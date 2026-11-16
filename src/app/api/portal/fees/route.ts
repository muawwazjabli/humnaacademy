import { NextRequest, NextResponse } from "next/server";
import { getAdminAccessToken } from "@/lib/firebase-admin-sdk";
import { getDocument, listCollection, setDocument, updateDocument } from "@/lib/firebase-rest";
import { getAuthenticatedStudent, getAuthenticatedTeacher } from "@/lib/portal-auth";
import { getAuthenticatedAdmin } from "@/lib/auth-server";
import { FeeRecord, StudentRecord } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const studentAuth = await getAuthenticatedStudent();
    const adminAuth = await getAuthenticatedAdmin();

    if (!studentAuth && !adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetStudentId = searchParams.get("studentId") || (studentAuth ? studentAuth.student.id : null);

    const token = await getAdminAccessToken();
    const res = await listCollection<FeeRecord>("feeRecords", token || undefined, 100);

    let items = res.docs.map((d) => ({ ...d.data, id: d.id }));

    if (targetStudentId) {
      items = items.filter((r) => r.studentId === targetStudentId);
    }

    items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return NextResponse.json({ success: true, fees: items });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load fee records." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const studentAuth = await getAuthenticatedStudent();
    const adminAuth = await getAuthenticatedAdmin();

    if (!studentAuth && !adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      studentId = studentAuth ? studentAuth.student.id : "",
      month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
      amount = "$40",
      currency = "USD",
      status = studentAuth ? "verifying" : "due",
      receiptUrl = "",
      notes = "",
    } = body;

    const token = await getAdminAccessToken();
    const sDoc = await getDocument<StudentRecord>("students", studentId, token || undefined);
    const studentName = sDoc.doc?.data.fullName || (studentAuth?.student.fullName || "Student");

    const feeId = `fee-${studentId}-${month.replace(/\s+/g, "-").toLowerCase()}`;
    const now = new Date().toISOString();

    const record: FeeRecord = {
      id: feeId,
      studentId,
      studentName,
      month,
      amount,
      currency,
      status: status as any,
      receiptUrl,
      paidAt: status === "paid" ? now : undefined,
      notes,
      createdAt: now,
    };

    await setDocument("feeRecords", record as any, feeId, token || undefined);

    return NextResponse.json({ success: true, fee: record });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to record fee." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminAuth = await getAuthenticatedAdmin();
    if (!adminAuth) {
      return NextResponse.json({ error: "Only administrators can verify fee payments." }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, notes = "" } = body;

    const token = await getAdminAccessToken();
    const now = new Date().toISOString();

    await updateDocument(
      "feeRecords",
      id,
      {
        status,
        notes,
        paidAt: status === "paid" ? now : undefined,
      },
      token || undefined
    );

    return NextResponse.json({ success: true, message: `Fee updated to ${status}.` });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update fee record." }, { status: 500 });
  }
}
