import { NextResponse } from "next/server";
import { TEACHER_COOKIE_NAME } from "@/lib/portal-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out." });
  response.cookies.delete(TEACHER_COOKIE_NAME);
  return response;
}
