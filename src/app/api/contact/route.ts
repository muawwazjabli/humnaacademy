import { NextRequest, NextResponse } from "next/server";
import { setDocument } from "@/lib/firebase-rest";
import { createAdminNotification } from "@/lib/auth-server";
import { getAdminAccessToken } from "@/lib/firebase-admin-sdk";
import { isFirebaseConfigured } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!phone || phone.trim().length < 5) {
      return NextResponse.json({ error: "Please enter a valid phone or WhatsApp number." }, { status: 400 });
    }
    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: "Please write a brief message." }, { status: 400 });
    }

    const now = new Date().toISOString();
    let savedToFirebase = false;
    let docId = `MSG-${Date.now().toString().slice(-6)}`;

    if (isFirebaseConfigured()) {
      const saToken = (await getAdminAccessToken()) || undefined;
      const res = await setDocument(
        "contactMessages",
        {
          name: name.trim(),
          email: (email || "").trim(),
          phone: phone.trim(),
          subject: (subject || "General Inquiry").trim(),
          message: message.trim(),
          status: "New",
          internalNotes: "",
          createdAt: now,
          updatedAt: now,
        },
        undefined,
        saToken
      );

      if (res.success) {
        savedToFirebase = true;
        docId = res.id || docId;
        await createAdminNotification(
          "message",
          "New Contact Message",
          `${name.trim()} sent an inquiry regarding ${subject || "General Inquiry"}.`,
          "/admin/messages",
          docId,
          saToken
        );
      }
    }

    return NextResponse.json({
      success: true,
      id: docId,
      savedToFirebase,
      message: savedToFirebase
        ? "Your message has been delivered to Humna Academy administration."
        : "Your inquiry is prepared. Please click below to send directly via WhatsApp.",
    });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Unexpected error submitting message." },
      { status: 500 }
    );
  }
}
