#!/usr/bin/env node
/**
 * Humna Academy — Secure Initial Super Admin Setup Script
 * Usage:
 *   node scripts/setup-admin.mjs <email> <password> "<Full Name>"
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY (or FIREBASE_SERVICE_ACCOUNT_KEY)
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

async function getAccessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      sub: clientEmail,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
      scope:
        "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/identitytoolkit",
    })
  ).toString("base64url");

  const unsigned = `${header}.${payload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = signer.sign(privateKey.replace(/\\n/g, "\n"), "base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json.access_token;
}

async function main() {
  loadEnvLocal();

  const [, , email, password, name = "Super Admin"] = process.argv;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!email || !password) {
    console.error("Usage: node scripts/setup-admin.mjs <email> <password> \"<Full Name>\"");
    process.exit(1);
  }
  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY in .env.local."
    );
    process.exit(1);
  }

  console.log("Obtaining Firebase Service Account OAuth2 token...");
  const token = await getAccessToken(clientEmail, privateKey);

  console.log(`Creating or updating Firebase Auth user: ${email}...`);
  let uid;
  const createRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, password, displayName: name, emailVerified: true }),
    }
  );
  const createJson = await createRes.json();

  if (createRes.ok) {
    uid = createJson.localId;
    console.log("Created Firebase Auth user with UID:", uid);
  } else if (createJson?.error?.message?.includes("EMAIL_EXISTS")) {
    const lookupRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: [email] }),
      }
    );
    const lookupJson = await lookupRes.json();
    uid = lookupJson?.users?.[0]?.localId;
    console.log("Found existing Firebase Auth user UID:", uid);
  } else {
    throw new Error(JSON.stringify(createJson));
  }

  if (!uid) throw new Error("Unable to resolve UID.");

  // Set Custom Claims
  await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      localId: uid,
      customAttributes: JSON.stringify({ role: "super_admin", admin: true }),
    }),
  });

  // Create Firestore admins/{uid} document
  const now = new Date().toISOString();
  const fsRes = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${uid}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        fields: {
          uid: { stringValue: uid },
          email: { stringValue: email.toLowerCase() },
          name: { stringValue: name },
          role: { stringValue: "super_admin" },
          permissions: { arrayValue: { values: [] } },
          active: { booleanValue: true },
          createdAt: { timestampValue: now },
          updatedAt: { timestampValue: now },
        },
      }),
    }
  );

  if (!fsRes.ok) {
    throw new Error("Firestore admins write failed: " + (await fsRes.text()));
  }

  console.log("✅ Super Admin setup complete! You can now sign in at /admin/login");
}

main().catch((err) => {
  console.error("❌ Setup failed:", err.message);
  process.exit(1);
});
