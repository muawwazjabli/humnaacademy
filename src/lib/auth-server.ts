import crypto from "crypto";
import { cookies } from "next/headers";
import { getFirebaseConfig } from "./firebase";
import { getDocument, setDocument, updateDocument } from "./firebase-rest";
import { getAdminAccessToken } from "./firebase-admin-sdk";
import { AdminRole, AdminUser } from "@/types";

export const SESSION_COOKIE_NAME = "humna_admin_session";

interface SessionPayload {
  uid: string;
  email: string;
  idToken: string;
  refreshToken: string;
  expiresAt: number;
  rememberMe?: boolean;
}

function getEncryptionKey(): Buffer {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "humna"}-${
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "academy"
    }-session-key-v1`;
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptSession(payload: SessionPayload): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptSession(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [ivB64, tagB64, dataB64] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivB64, "base64url");
    const tag = Buffer.from(tagB64, "base64url");
    const encrypted = Buffer.from(dataB64, "base64url");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(decrypted.toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export async function signInWithFirebasePassword(
  email: string,
  password: string
): Promise<{
  success: boolean;
  uid?: string;
  email?: string;
  idToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
}> {
  const cfg = getFirebaseConfig();
  if (!cfg?.apiKey) {
    return { success: false, error: "Firebase API key is not configured." };
  }

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${cfg.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      const code = data?.error?.message || "INVALID_LOGIN_CREDENTIALS";
      let friendly = "Invalid email or password.";
      if (code.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
        friendly = "Too many failed login attempts. Please wait a few minutes and try again.";
      } else if (code.includes("USER_DISABLED")) {
        friendly = "This administrator account has been disabled.";
      }
      return { success: false, error: friendly };
    }

    return {
      success: true,
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: Number(data.expiresIn || 3600),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Authentication network error." };
  }
}

export async function sendFirebasePasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const cfg = getFirebaseConfig();
  if (!cfg?.apiKey) {
    return { success: false, error: "Firebase API key is not configured." };
  }

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${cfg.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: email.trim(),
        }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      const msg = data?.error?.message || "Unable to send password reset email.";
      if (msg.includes("EMAIL_NOT_FOUND")) {
        // Avoid enumerating accounts
        return { success: true };
      }
      return { success: false, error: msg };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to contact Firebase Auth." };
  }
}

async function refreshFirebaseIdToken(refreshToken: string): Promise<{
  idToken: string;
  refreshToken: string;
  expiresIn: number;
} | null> {
  const cfg = getFirebaseConfig();
  if (!cfg?.apiKey || !refreshToken) return null;

  try {
    const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${cfg.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return {
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresIn: Number(data.expires_in || 3600),
    };
  } catch {
    return null;
  }
}

async function verifyIdTokenWithFirebase(idToken: string): Promise<{ uid: string; email: string } | null> {
  const cfg = getFirebaseConfig();
  if (!cfg?.apiKey || !idToken) return null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${cfg.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const user = data?.users?.[0];
    if (!user || user.disabled) return null;
    return { uid: user.localId, email: user.email };
  } catch {
    return null;
  }
}

export interface AuthenticatedContext {
  admin: AdminUser;
  idToken: string;
  authToken: string; // Prefer Service Account token when available, else user's Firebase idToken
}

/**
 * Verifies the current request's admin session from HttpOnly cookie,
 * refreshes token if needed, and validates admin role & active status in Firestore.
 */
export async function getAuthenticatedAdmin(): Promise<AuthenticatedContext | null> {
  try {
    const cookieStore = cookies();
    const rawCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!rawCookie) return null;

    const session = decryptSession(rawCookie);
    if (!session || !session.idToken || !session.uid) return null;

    let activeIdToken = session.idToken;
    let activeRefreshToken = session.refreshToken;
    let activeExpiresAt = session.expiresAt;

    // Refresh if expired or within 2 minutes of expiry
    if (Date.now() > activeExpiresAt - 120_000 && activeRefreshToken) {
      const refreshed = await refreshFirebaseIdToken(activeRefreshToken);
      if (!refreshed) return null;
      activeIdToken = refreshed.idToken;
      activeRefreshToken = refreshed.refreshToken;
      activeExpiresAt = Date.now() + refreshed.expiresIn * 1000;
    }

    // Verify token directly against Firebase Auth
    const verifiedUser = await verifyIdTokenWithFirebase(activeIdToken);
    if (!verifiedUser || verifiedUser.uid !== session.uid) {
      return null;
    }

    // Fetch admin record using Service Account if configured, otherwise the verified admin idToken
    const saToken = await getAdminAccessToken();
    const authToken = saToken || activeIdToken;

    const adminRes = await getDocument<AdminUser>("admins", verifiedUser.uid, authToken);
    if (!adminRes.doc) return null;

    const adminData = adminRes.doc.data;
    if (adminData.active === false) return null;

    return {
      admin: {
        uid: verifiedUser.uid,
        email: adminData.email || verifiedUser.email,
        name: adminData.name || "Administrator",
        role: (adminData.role || "editor") as AdminRole,
        permissions: Array.isArray(adminData.permissions) ? adminData.permissions : [],
        active: true,
        lastLogin: adminData.lastLogin,
        createdAt: adminData.createdAt || "",
        updatedAt: adminData.updatedAt || "",
      },
      idToken: activeIdToken,
      authToken,
    };
  } catch (err) {
    console.error("getAuthenticatedAdmin error:", err);
    return null;
  }
}

export type AdminModule =
  | "dashboard"
  | "courses"
  | "students"
  | "teachers"
  | "trialRequests"
  | "pricing"
  | "blogs"
  | "testimonials"
  | "faqs"
  | "gallery"
  | "messages"
  | "websiteContent"
  | "settings"
  | "users"
  | "activityLogs"
  | "notifications"
  | "upload";

const ROLE_DEFAULT_MODULES: Record<AdminRole, AdminModule[]> = {
  super_admin: [
    "dashboard",
    "courses",
    "students",
    "teachers",
    "trialRequests",
    "pricing",
    "blogs",
    "testimonials",
    "faqs",
    "gallery",
    "messages",
    "websiteContent",
    "settings",
    "users",
    "activityLogs",
    "notifications",
    "upload",
  ],
  admin: [
    "dashboard",
    "courses",
    "students",
    "teachers",
    "trialRequests",
    "pricing",
    "blogs",
    "testimonials",
    "faqs",
    "gallery",
    "messages",
    "websiteContent",
    "notifications",
    "activityLogs",
    "upload",
  ],
  editor: [
    "dashboard",
    "blogs",
    "testimonials",
    "faqs",
    "gallery",
    "websiteContent",
    "notifications",
    "upload",
  ],
};

export function hasModulePermission(admin: AdminUser, moduleName: AdminModule): boolean {
  if (!admin || !admin.active) return false;
  if (admin.role === "super_admin") return true;
  if (moduleName === "users" || moduleName === "settings") {
    return false; // Strictly Super Admin only
  }
  const allowedByRole = ROLE_DEFAULT_MODULES[admin.role] || [];
  if (admin.permissions && admin.permissions.length > 0) {
    return admin.permissions.includes(moduleName) || moduleName === "dashboard" || moduleName === "notifications";
  }
  return allowedByRole.includes(moduleName);
}

/**
 * Helper to record an entry in Firestore `activityLogs`.
 */
export async function logAdminActivity(
  authToken: string,
  admin: AdminUser,
  action: string,
  moduleName: string,
  summary: string,
  recordId?: string
): Promise<void> {
  try {
    await setDocument(
      "activityLogs",
      {
        adminId: admin.uid,
        adminEmail: admin.email,
        adminName: admin.name,
        action,
        module: moduleName,
        recordId: recordId || "",
        summary,
        timestamp: new Date().toISOString(),
      },
      undefined,
      authToken
    );
  } catch (err) {
    console.warn("Activity logging skipped:", err);
  }
}

/**
 * Helper to create an admin notification in Firestore `notifications`.
 */
export async function createAdminNotification(
  type: "trial" | "message" | "student" | "testimonial" | "system",
  title: string,
  message: string,
  link: string,
  recordId?: string,
  authToken?: string
): Promise<void> {
  try {
    const saToken = authToken || (await getAdminAccessToken()) || undefined;
    await setDocument(
      "notifications",
      {
        type,
        title,
        message,
        link,
        read: false,
        recordId: recordId || "",
        createdAt: new Date().toISOString(),
      },
      undefined,
      saToken
    );
  } catch (err) {
    console.warn("Notification creation skipped:", err);
  }
}
