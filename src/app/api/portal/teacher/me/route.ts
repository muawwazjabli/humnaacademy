import { NextResponse } from "next/server";
import { getAuthenticatedTeacher } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getAuthenticatedTeacher();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { portalPassword, ...safeTeacher } = auth.teacher;
    const safeStudents = auth.students.map(({ portalPassword: sp, ...s }) => s);

    return NextResponse.json({
      success: true,
      teacher: safeTeacher,
      students: safeStudents,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load teacher profile." }, { status: 500 });
  }
}
