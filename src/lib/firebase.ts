import { TrialBookingPayload } from "@/types";

export interface FirebaseConfig {
  apiKey: string;
  projectId: string;
  authDomain?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/**
 * Reads Firebase configuration from environment variables.
 * Supports both client-facing NEXT_PUBLIC_* and server-side environment variables.
 */
export function getFirebaseConfig(): FirebaseConfig | null {
  const apiKey =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    process.env.FIREBASE_API_KEY ||
    "";
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    "";

  if (!projectId) {
    return null;
  }

  return {
    apiKey,
    projectId,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      process.env.FIREBASE_AUTH_DOMAIN ||
      `${projectId}.firebaseapp.com`,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.FIREBASE_STORAGE_BUCKET ||
      `${projectId}.appspot.com`,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      process.env.FIREBASE_MESSAGING_SENDER_ID ||
      "",
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
      process.env.FIREBASE_APP_ID ||
      "",
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config && config.projectId);
}

/**
 * Saves a trial booking request to Google Cloud Firestore via official REST API.
 * This runs natively on Next.js serverless functions without heavy SDK dependencies,
 * avoiding npm bundle bloat and local filesystem locking issues.
 */
export async function saveTrialBookingToFirebase(
  data: Partial<TrialBookingPayload>,
  referenceId: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const config = getFirebaseConfig();
  if (!config) {
    return {
      success: false,
      error: "Firebase project ID is not configured in environment variables.",
    };
  }

  try {
    const url = config.apiKey
      ? `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/trial_requests?key=${config.apiKey}`
      : `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/trial_requests`;

    // Map payload into Firestore REST format
    const firestoreFields = {
      referenceId: { stringValue: referenceId },
      fullName: { stringValue: data.fullName || "" },
      ageGroup: { stringValue: data.ageGroup || "child" },
      parentName: { stringValue: data.parentName || "" },
      email: { stringValue: data.email || "" },
      whatsappNumber: { stringValue: data.whatsappNumber || "" },
      country: { stringValue: data.country || "Not specified" },
      preferredCourse: { stringValue: data.preferredCourse || "" },
      readingLevel: { stringValue: data.readingLevel || "Beginner" },
      preferredTeacher: { stringValue: data.preferredTeacher || "no_preference" },
      preferredLanguage: { stringValue: data.preferredLanguage || "English" },
      preferredDays: {
        arrayValue: {
          values: (data.preferredDays || []).map((day) => ({
            stringValue: day,
          })),
        },
      },
      preferredTime: { stringValue: data.preferredTime || "Flexible" },
      timeZone: { stringValue: data.timeZone || "UTC" },
      additionalMessage: { stringValue: data.additionalMessage || "" },
      status: { stringValue: "new" },
      source: { stringValue: "Humna Academy Website" },
      createdAt: { timestampValue: new Date().toISOString() },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: firestoreFields,
      }),
    });

    if (res.ok) {
      const responseData = await res.json();
      const documentPath = responseData.name || "";
      const docId = documentPath.split("/").pop() || referenceId;
      return { success: true, id: docId };
    } else {
      const errText = await res.text();
      console.error("Firestore REST API response error:", res.status, errText);
      return {
        success: false,
        error: `Firestore API error: ${res.statusText} (${res.status})`,
      };
    }
  } catch (error: any) {
    console.error("Firebase connection exception:", error);
    return {
      success: false,
      error: error?.message || "Failed to reach Firebase Firestore.",
    };
  }
}
