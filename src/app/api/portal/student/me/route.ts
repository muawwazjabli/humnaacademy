import { NextResponse } from "next/server";
import { getAuthenticatedStudent } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getAuthenticatedStudent();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Omit sensitive password before sending to client
    const { portalPassword, ...safeStudent } = auth.student;
    let safeTeacher = null;
    if (auth.teacher) {
      const { portalPassword: tp, ...st } = auth.teacher;
      safeTeacher = st;
    }

    return NextResponse.json({
      success: true,
      student: safeStudent,
      teacher: safeTeacher,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load student profile." }, { status: 500 });
  }
}
