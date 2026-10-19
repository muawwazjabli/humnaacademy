import { NextRequest, NextResponse } from "next/server";
import { TrialBookingPayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const data: Partial<TrialBookingPayload> = await req.json();

    // Required Field Validation
    if (!data.fullName || data.fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid full name." },
        { status: 400 }
      );
    }

    if (!data.whatsappNumber || data.whatsappNumber.trim().length < 7) {
      return NextResponse.json(
        { error: "Please provide a valid WhatsApp or contact phone number." },
        { status: 400 }
      );
    }

    if (!data.preferredCourse) {
      return NextResponse.json(
        { error: "Please select your preferred course." },
        { status: 400 }
      );
    }

    if (!data.timeZone) {
      return NextResponse.json(
        { error: "Please select your local time zone." },
        { status: 400 }
      );
    }

    if (!data.consentAgreed) {
      return NextResponse.json(
        { error: "You must accept the privacy policy to proceed." },
        { status: 400 }
      );
    }

    // Check if Supabase or database credentials are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    const referenceId = `HA-${Date.now().toString().slice(-6)}`;
    let isPersistedToDatabase = false;

    if (supabaseUrl && supabaseKey) {
      try {
        // Dynamic fetch to Supabase REST API without bundling heavy SDK
        const response = await fetch(`${supabaseUrl}/rest/v1/trial_requests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            reference_id: referenceId,
            full_name: data.fullName,
            age_group: data.ageGroup,
            parent_name: data.parentName || null,
            email: data.email || null,
            whatsapp_number: data.whatsappNumber,
            country: data.country || "Not specified",
            preferred_course: data.preferredCourse,
            reading_level: data.readingLevel || "Beginner",
            preferred_teacher: data.preferredTeacher || "no_preference",
            preferred_language: data.preferredLanguage || "English",
            preferred_days: data.preferredDays || [],
            preferred_time: data.preferredTime || "Flexible",
            time_zone: data.timeZone,
            additional_message: data.additionalMessage || null,
            created_at: new Date().toISOString()
          })
        });

        if (response.ok) {
          isPersistedToDatabase = true;
        } else {
          console.warn("Supabase API returned non-OK status. Falling back to structured log response.");
        }
      } catch (dbErr) {
        console.warn("Could not reach Supabase endpoint:", dbErr);
      }
    }

    // Server-side safe payload preparation
    return NextResponse.json({
      success: true,
      referenceId,
      isPersistedToDatabase,
      mode: isPersistedToDatabase ? "production" : "demo",
      message: isPersistedToDatabase
        ? "Your trial request has been securely recorded in our database. Our academic coordinator will contact you via WhatsApp."
        : "Demo / Standalone Mode Active: Your trial request has been validated and prepared. You can immediately forward the prefilled details to the academy via official WhatsApp.",
      summary: {
        name: data.fullName,
        course: data.preferredCourse,
        timeZone: data.timeZone,
        whatsapp: data.whatsappNumber
      }
    });
  } catch (error) {
    console.error("Trial booking API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try contacting us on WhatsApp." },
      { status: 500 }
    );
  }
}
