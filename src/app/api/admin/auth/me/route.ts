import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ authenticated: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, admin: auth.admin });
}
