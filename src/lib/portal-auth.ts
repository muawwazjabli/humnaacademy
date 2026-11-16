import crypto from "crypto";
import { cookies } from "next/headers";
import { getAdminAccessToken } from "./firebase-admin-sdk";
import { getDocument, listCollection } from "./firebase-rest";
import { StudentRecord, TeacherProfile } from "@/types";

export const STUDENT_COOKIE_NAME = "humna_student_session";
export const TEACHER_COOKIE_NAME = "humna_teacher_session";

export interface PortalSessionPayload {
  type: "student" | "teacher";
  id: string;
  name: string;
  username: string;
  issuedAt: number;
}

function getPortalKey(): Buffer {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "humna"}-portal-v1`;
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptPortalSession(payload: PortalSessionPayload): string {
  const key = getPortalKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptPortalSession(token: string): PortalSessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [ivB64, tagB64, dataB64] = parts;
    const key = getPortalKey();
    const iv = Buffer.from(ivB64, "base64url");
    const tag = Buffer.from(tagB64, "base64url");
    const encrypted = Buffer.from(dataB64, "base64url");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(decrypted.toString("utf8")) as PortalSessionPayload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedStudent(): Promise<{
  session: PortalSessionPayload;
  student: StudentRecord;
  teacher?: TeacherProfile | null;
} | null> {
  const cookieStore = cookies();
  const raw = cookieStore.get(STUDENT_COOKIE_NAME)?.value;
  if (!raw) return null;

  const session = decryptPortalSession(raw);
  if (!session || session.type !== "student") return null;

  const token = await getAdminAccessToken();
  const res = await getDocument<StudentRecord>("students", session.id, token || undefined);
  if (!res.doc) return null;

  const student = res.doc.data;
  if (student.status === "Inactive") return null;

  let teacher: TeacherProfile | null = null;
  if (student.assignedTeacherId) {
    const tRes = await getDocument<TeacherProfile>("teachers", student.assignedTeacherId, token || undefined);
    if (tRes.doc) teacher = tRes.doc.data;
  }

  return { session, student, teacher };
}

export async function getAuthenticatedTeacher(): Promise<{
  session: PortalSessionPayload;
  teacher: TeacherProfile;
  students: StudentRecord[];
} | null> {
  const cookieStore = cookies();
  const raw = cookieStore.get(TEACHER_COOKIE_NAME)?.value;
  if (!raw) return null;

  const session = decryptPortalSession(raw);
  if (!session || session.type !== "teacher") return null;

  const token = await getAdminAccessToken();
  const tRes = await getDocument<TeacherProfile>("teachers", session.id, token || undefined);
  if (!tRes.doc) return null;

  const teacher = tRes.doc.data;
  if (teacher.active === false) return null;

  // Fetch all students assigned to this teacher
  const sRes = await listCollection<StudentRecord>("students", token || undefined, 100);
  const students = sRes.docs
    .map((d) => d.data)
    .filter(
      (s) =>
        s.assignedTeacherId === teacher.id ||
        (s.assignedTeacherName && s.assignedTeacherName.toLowerCase() === teacher.name.toLowerCase())
    );

  return { session, teacher, students };
}
