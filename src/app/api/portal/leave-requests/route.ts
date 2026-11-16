import { NextRequest, NextResponse } from "next/server";
import { getAdminAccessToken } from "@/lib/firebase-admin-sdk";
import { getDocument, listCollection, setDocument, updateDocument } from "@/lib/firebase-rest";
import { getAuthenticatedStudent, getAuthenticatedTeacher } from "@/lib/portal-auth";
import { getAuthenticatedAdmin } from "@/lib/auth-server";
import { LeaveRequestRecord, StudentRecord } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const studentAuth = await getAuthenticatedStudent();
    const teacherAuth = await getAuthenticatedTeacher();
    const adminAuth = await getAuthenticatedAdmin();

    if (!studentAuth && !teacherAuth && !adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await getAdminAccessToken();
    const res = await listCollection<LeaveRequestRecord>("leaveRequests", token || undefined, 100);

    let items = res.docs.map((d) => ({ ...d.data, id: d.id }));

    if (studentAuth) {
      items = items.filter((r) => r.studentId === studentAuth.student.id);
    } else if (teacherAuth) {
      items = items.filter((r) => r.teacherId === teacherAuth.teacher.id);
    }

    items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return NextResponse.json({ success: true, requests: items });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load leave requests." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const studentAuth = await getAuthenticatedStudent();
    if (!studentAuth) {
      return NextResponse.json({ error: "Only logged-in students can submit leave requests." }, { status: 401 });
    }

    const body = await req.json();
    const { type = "leave", date, preferredNewTime = "", reason = "" } = body;

    if (!date || !reason) {
      return NextResponse.json({ error: "Date and reason are required." }, { status: 400 });
    }

    const token = await getAdminAccessToken();
    const reqId = `leave-${studentAuth.student.id}-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const record: LeaveRequestRecord = {
      id: reqId,
      studentId: studentAuth.student.id,
      studentName: studentAuth.student.fullName,
      teacherId: studentAuth.student.assignedTeacherId || "",
      teacherName: studentAuth.student.assignedTeacherName || "",
      type,
      date,
      preferredNewTime,
      reason,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    await setDocument("leaveRequests", record as any, reqId, token || undefined);

    return NextResponse.json({ success: true, request: record });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const teacherAuth = await getAuthenticatedTeacher();
    const adminAuth = await getAuthenticatedAdmin();

    if (!teacherAuth && !adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, adminNotes = "" } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and Status are required." }, { status: 400 });
    }

    const token = await getAdminAccessToken();
    const now = new Date().toISOString();

    await updateDocument(
      "leaveRequests",
      id,
      {
        status,
        adminNotes,
        updatedAt: now,
      },
      token || undefined
    );

    return NextResponse.json({ success: true, message: `Request updated to ${status}.` });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update request." }, { status: 500 });
  }
}
