import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin, hasModulePermission, logAdminActivity } from "@/lib/auth-server";
import { getFirebaseConfig } from "@/lib/firebase";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasModulePermission(auth.admin, "upload")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cfg = getFirebaseConfig();
  if (!cfg?.storageBucket) {
    return NextResponse.json(
      { error: "Firebase Storage Bucket is not configured." },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = ((formData.get("folder") as string) || "uploads").replace(/[^a-zA-Z0-9_-]/g, "");

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed formats: JPG, PNG, WebP, SVG." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum allowed size of 5 MB." },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectPath = `${folder}/${Date.now()}-${safeName}`;
    const arrayBuffer = await file.arrayBuffer();

    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${cfg.storageBucket}/o?uploadType=media&name=${encodeURIComponent(
      objectPath
    )}`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        Authorization: `Bearer ${auth.authToken}`,
      },
      body: arrayBuffer,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Firebase Storage upload error:", res.status, errText);
      return NextResponse.json(
        {
          error: `Firebase Storage upload failed (${res.status}). Ensure Firebase Storage is activated in Firebase Console and Storage rules allow authenticated admin uploads.`,
        },
        { status: 500 }
      );
    }

    const meta = await res.json();
    const downloadToken = meta.downloadTokens ? `&token=${meta.downloadTokens}` : "";
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${cfg.storageBucket}/o/${encodeURIComponent(
      objectPath
    )}?alt=media${downloadToken}`;

    await logAdminActivity(
      auth.authToken,
      auth.admin,
      "Image Uploaded",
      "Media Storage",
      `Uploaded ${safeName} (${Math.round(file.size / 1024)} KB) to ${folder}/`,
      objectPath
    );

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: objectPath,
      size: file.size,
      contentType: file.type,
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected upload error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cfg = getFirebaseConfig();
  const path = req.nextUrl.searchParams.get("path");
  if (!cfg?.storageBucket || !path) {
    return NextResponse.json({ error: "Storage path missing." }, { status: 400 });
  }

  try {
    const deleteUrl = `https://firebasestorage.googleapis.com/v0/b/${cfg.storageBucket}/o/${encodeURIComponent(
      path
    )}`;
    const res = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
    });

    if (!res.ok && res.status !== 404) {
      return NextResponse.json({ error: "Failed to delete file from Storage." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Delete error" }, { status: 500 });
  }
}
