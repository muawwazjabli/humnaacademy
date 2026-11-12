import { NextResponse } from "next/server";
import { getAuthenticatedAdmin, logAdminActivity, SESSION_COOKIE_NAME } from "@/lib/auth-server";

export async function POST() {
  try {
    const auth = await getAuthenticatedAdmin();
    if (auth) {
      await logAdminActivity(
        auth.authToken,
        auth.admin,
        "Admin Logout",
        "Auth",
        `Administrator ${auth.admin.email} logged out.`,
        auth.admin.uid
      );
    }
  } catch {
    // ignore logging failure on logout
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
