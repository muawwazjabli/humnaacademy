import { NextRequest, NextResponse } from "next/server";
import { getAdminAccessToken } from "@/lib/firebase-admin-sdk";
import { listCollection } from "@/lib/firebase-rest";
import { encryptPortalSession, TEACHER_COOKIE_NAME } from "@/lib/portal-auth";
import { TeacherProfile } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Please enter both username and password." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    const token = await getAdminAccessToken();
    const res = await listCollection<TeacherProfile>("teachers", token || undefined, 50);

    const match = res.docs
      .map((d) => d.data)
      .find((t) => {
        const u = (t.portalUsername || "").trim().toLowerCase();
        const e = (t.email || "").trim().toLowerCase();
        const n = (t.name || "").trim().toLowerCase();

        const userMatches = u === cleanUsername || e === cleanUsername || n === cleanUsername;
        const passMatches = (t.portalPassword || "").trim() === cleanPassword;

        return userMatches && passMatches;
      });

    if (!match) {
      return NextResponse.json(
        { error: "Invalid teacher credentials. Please check your username and password." },
        { status: 401 }
      );
    }

    if (match.active === false) {
      return NextResponse.json(
        { error: "This teacher account is currently deactivated." },
        { status: 403 }
      );
    }

    const sessionToken = encryptPortalSession({
      type: "teacher",
      id: match.id,
      name: match.name,
      username: match.portalUsername || match.email || match.name,
      issuedAt: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      teacher: {
        id: match.id,
        name: match.name,
        title: match.title,
        photoUrl: match.photoUrl,
      },
    });

    response.cookies.set(TEACHER_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error("Teacher login error:", err);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
