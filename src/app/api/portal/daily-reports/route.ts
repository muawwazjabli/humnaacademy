import { NextRequest, NextResponse } from "next/server";
import { getAdminAccessToken } from "@/lib/firebase-admin-sdk";
import { getDocument, listCollection, setDocument } from "@/lib/firebase-rest";
import { getAuthenticatedStudent, getAuthenticatedTeacher } from "@/lib/portal-auth";
import { getAuthenticatedAdmin } from "@/lib/auth-server";
import { DailyClassReport, StudentRecord } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const studentAuth = await getAuthenticatedStudent();
    const teacherAuth = await getAuthenticatedTeacher();
    const adminAuth = await getAuthenticatedAdmin();

    if (!studentAuth && !teacherAuth && !adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetStudentId = searchParams.get("studentId") || (studentAuth ? studentAuth.student.id : null);

    const token = await getAdminAccessToken();
    const res = await listCollection<DailyClassReport>("dailyReports", token || undefined, 100);

    let items = res.docs.map((d) => ({ ...d.data, id: d.id }));

    if (targetStudentId) {
      items = items.filter((r) => r.studentId === targetStudentId);
    } else if (teacherAuth) {
      items = items.filter((r) => r.teacherId === teacherAuth.teacher.id);
    }

    items.sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.createdAt || "").localeCompare(a.createdAt || ""));

    return NextResponse.json({ success: true, reports: items });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load class reports." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const teacherAuth = await getAuthenticatedTeacher();
    const adminAuth = await getAuthenticatedAdmin();

    if (!teacherAuth && !adminAuth) {
      return NextResponse.json({ error: "Only teachers or administrators can submit daily reports." }, { status: 403 });
    }

    const body = await req.json();
    const {
      studentId,
      date,
      attendance = "Present",
      sabaq = "",
      sabqi = "",
      manzil = "",
      tajweedMistakes = 0,
      rating = 5,
      teacherNotes = "",
    } = body;

    if (!studentId || !date) {
      return NextResponse.json({ error: "Student ID and Date are required." }, { status: 400 });
    }

    const token = await getAdminAccessToken();
    const sDoc = await getDocument<StudentRecord>("students", studentId, token || undefined);
    const studentName = sDoc.doc?.data.fullName || "Student";

    const reportId = `report-${studentId}-${date}-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const report: DailyClassReport = {
      id: reportId,
      studentId,
      studentName,
      teacherId: teacherAuth ? teacherAuth.teacher.id : "admin",
      teacherName: teacherAuth ? teacherAuth.teacher.name : (adminAuth?.admin.name || "Academy Coordinator"),
      date,
      attendance,
      sabaq,
      sabqi,
      manzil,
      tajweedMistakes: Number(tajweedMistakes) || 0,
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      teacherNotes,
      createdAt: now,
    };

    await setDocument("dailyReports", report as any, reportId, token || undefined);

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error("Daily report submission error:", err);
    return NextResponse.json({ error: "Failed to save daily report." }, { status: 500 });
  }
}
