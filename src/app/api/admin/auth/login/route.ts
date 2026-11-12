import { NextRequest, NextResponse } from "next/server";
import {
  encryptSession,
  logAdminActivity,
  SESSION_COOKIE_NAME,
  signInWithFirebasePassword,
} from "@/lib/auth-server";
import { getDocument, updateDocument } from "@/lib/firebase-rest";
import { getAdminAccessToken } from "@/lib/firebase-admin-sdk";
import { AdminUser } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both email address and password." },
        { status: 400 }
      );
    }

    const authResult = await signInWithFirebasePassword(email, password);
    if (!authResult.success || !authResult.uid || !authResult.idToken) {
      return NextResponse.json(
        { error: authResult.error || "Invalid email or password." },
        { status: 401 }
      );
    }

    const saToken = await getAdminAccessToken();
    const authToken = saToken || authResult.idToken;

    // Verify user has an active admin profile in Firestore `admins/{uid}`
    const adminCheck = await getDocument<AdminUser>("admins", authResult.uid, authToken);
    if (!adminCheck.doc) {
      return NextResponse.json(
        {
          error:
            "Access denied: This account does not have administrator privileges. Contact the Super Admin.",
        },
        { status: 403 }
      );
    }

    const adminData = adminCheck.doc.data;
    if (adminData.active === false) {
      return NextResponse.json(
        { error: "This administrator account has been deactivated." },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();
    await updateDocument("admins", authResult.uid, { lastLogin: now }, authToken);

    const adminUser: AdminUser = {
      uid: authResult.uid,
      email: adminData.email || authResult.email || email,
      name: adminData.name || "Administrator",
      role: adminData.role || "editor",
      permissions: Array.isArray(adminData.permissions) ? adminData.permissions : [],
      active: true,
      lastLogin: now,
      createdAt: adminData.createdAt || now,
      updatedAt: now,
    };

    await logAdminActivity(
      authToken,
      adminUser,
      "Admin Login",
      "Auth",
      `Administrator ${adminUser.email} signed in (${adminUser.role}).`,
      adminUser.uid
    );

    const sealed = encryptSession({
      uid: authResult.uid,
      email: adminUser.email,
      idToken: authResult.idToken,
      refreshToken: authResult.refreshToken || "",
      expiresAt: Date.now() + (authResult.expiresIn || 3600) * 1000,
      rememberMe: Boolean(rememberMe),
    });

    const response = NextResponse.json({
      success: true,
      admin: adminUser,
    });

    response.cookies.set(SESSION_COOKIE_NAME, sealed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 8, // 7 days or 8 hours
    });

    return response;
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "An unexpected authentication error occurred." },
      { status: 500 }
    );
  }
}
