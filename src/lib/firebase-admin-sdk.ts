import crypto from "crypto";
import { getFirebaseConfig } from "./firebase";

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id?: string;
}

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

export function getServiceAccountCredentials(): ServiceAccount | null {
  try {
    const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (rawJson) {
      const parsed = JSON.parse(rawJson);
      if (parsed.client_email && parsed.private_key) {
        return {
          client_email: parsed.client_email,
          private_key: parsed.private_key.replace(/\\n/g, "\n"),
          project_id: parsed.project_id,
        };
      }
    }

    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (clientEmail && privateKey) {
      return {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
      };
    }
  } catch (err) {
    console.warn("Invalid Firebase Service Account JSON:", err);
  }
  return null;
}

/**
 * Generates a short-lived Google OAuth2 Access Token using Service Account RS256 JWT.
 * Requires zero external SDK dependencies.
 */
export async function getAdminAccessToken(): Promise<string | null> {
  const sa = getServiceAccountCredentials();
  if (!sa) return null;

  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.accessToken;
  }

  try {
    const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({
        iss: sa.client_email,
        sub: sa.client_email,
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
        scope:
          "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/devstorage.full_control",
      })
    ).toString("base64url");

    const unsigned = `${header}.${payload}`;
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsigned);
    const signature = signer.sign(sa.private_key, "base64url");
    const jwt = `${unsigned}.${signature}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!res.ok) {
      console.error("Failed to obtain Google OAuth2 token:", await res.text());
      return null;
    }

    const json = await res.json();
    cachedToken = {
      accessToken: json.access_token,
      expiresAt: now + (json.expires_in || 3600),
    };
    return cachedToken.accessToken;
  } catch (err) {
    console.error("Service Account token generation error:", err);
    return null;
  }
}

/**
 * Creates a Firebase Auth user and sets custom claims via Identity Toolkit Admin API (if Service Account is configured).
 */
export async function adminCreateAuthUser(
  email: string,
  password: string,
  displayName: string,
  role: string
): Promise<{ success: boolean; uid?: string; error?: string }> {
  const token = await getAdminAccessToken();
  const cfg = getFirebaseConfig();
  if (!token || !cfg?.projectId) {
    return {
      success: false,
      error: "Firebase Service Account credentials are not configured on the server for creating new Auth users automatically.",
    };
  }

  try {
    const createRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${cfg.projectId}/accounts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password,
          displayName,
          emailVerified: true,
        }),
      }
    );

    const createJson = await createRes.json();
    if (!createRes.ok) {
      return {
        success: false,
        error: createJson?.error?.message || "Failed to create Firebase user",
      };
    }

    const uid = createJson.localId;

    // Set Custom Claims
    await adminSetCustomClaims(uid, { role, admin: true });

    return { success: true, uid };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error creating auth user" };
  }
}

export async function adminSetCustomClaims(
  uid: string,
  claims: Record<string, unknown>
): Promise<boolean> {
  const token = await getAdminAccessToken();
  const cfg = getFirebaseConfig();
  if (!token || !cfg?.projectId) return false;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${cfg.projectId}/accounts:update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          localId: uid,
          customAttributes: JSON.stringify(claims),
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function adminDisableAuthUser(uid: string, disable: boolean): Promise<boolean> {
  const token = await getAdminAccessToken();
  const cfg = getFirebaseConfig();
  if (!token || !cfg?.projectId) return false;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${cfg.projectId}/accounts:update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          localId: uid,
          disableUser: disable,
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
