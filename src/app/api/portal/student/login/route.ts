import { NextRequest, NextResponse } from "next/server";
import { getAdminAccessToken } from "@/lib/firebase-admin-sdk";
import { listCollection } from "@/lib/firebase-rest";
import { encryptPortalSession, STUDENT_COOKIE_NAME } from "@/lib/portal-auth";
import { StudentRecord } from "@/types";

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
    const res = await listCollection<StudentRecord>("students", token || undefined, 100);

    const match = res.docs
      .map((d) => d.data)
      .find((s) => {
        const u = (s.portalUsername || "").trim().toLowerCase();
        const e = (s.email || "").trim().toLowerCase();
        const p = (s.whatsappNumber || "").replace(/\D/g, "");
        const queryClean = cleanUsername.replace(/\D/g, "");

        const userMatches =
          u === cleanUsername ||
          e === cleanUsername ||
          (queryClean.length >= 7 && p.includes(queryClean));

        const passMatches = (s.portalPassword || "").trim() === cleanPassword;

        return userMatches && passMatches;
      });

    if (!match) {
      return NextResponse.json(
        { error: "Invalid student login credentials. Please check your username and password." },
        { status: 401 }
      );
    }

    if (match.status === "Inactive") {
      return NextResponse.json(
        { error: "This student account is currently inactive. Please contact the academy administration." },
        { status: 403 }
      );
    }

    const sessionToken = encryptPortalSession({
      type: "student",
      id: match.id,
      name: match.fullName,
      username: match.portalUsername || match.email || match.fullName,
      issuedAt: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      student: {
        id: match.id,
        fullName: match.fullName,
        selectedCourse: match.selectedCourse,
        classTime: match.classTime,
        classDays: match.classDays,
        status: match.status,
      },
    });

    response.cookies.set(STUDENT_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error("Student login error:", err);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
