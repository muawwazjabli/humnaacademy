import { NextRequest, NextResponse } from "next/server";
import { sendFirebasePasswordReset } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await sendFirebasePasswordReset(email);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send password reset link." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "If an administrator account exists for this email, a password reset link has been sent to your inbox.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error processing password reset." },
      { status: 500 }
    );
  }
}
