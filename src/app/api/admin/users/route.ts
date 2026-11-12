import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth-server";
import {
  adminCreateAuthUser,
  adminDisableAuthUser,
  adminSetCustomClaims,
  getServiceAccountCredentials,
} from "@/lib/firebase-admin-sdk";
import { listCollection, setDocument, updateDocument } from "@/lib/firebase-rest";
import { AdminRole, AdminUser } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await getAuthenticatedAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (auth.admin.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden: Super Admin access required." }, { status: 403 });
  }

  const res = await listCollection<AdminUser>("admins", auth.authToken, 100);
  if (res.error) return NextResponse.json({ error: res.error }, { status: 500 });

  return NextResponse.json({
    items: res.docs.map((d) => d.data),
    hasServiceAccount: Boolean(getServiceAccountCredentials()),
  });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (auth.admin.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden: Only Super Admin can add administrators." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { email, password, name, role, permissions, existingUid } = body as {
      email: string;
      password?: string;
      name: string;
      role: AdminRole;
      permissions?: string[];
      existingUid?: string;
    };

    if (!email || !name || !role) {
      return NextResponse.json({ error: "Email, name, and role are required." }, { status: 400 });
    }

    let uid = existingUid?.trim();

    if (!uid) {
      if (!password || password.length < 8) {
        return NextResponse.json(
          { error: "Password (min 8 chars) is required when creating a new Firebase Auth account." },
          { status: 400 }
        );
      }

      const created = await adminCreateAuthUser(email, password, name, role);
      if (!created.success || !created.uid) {
        return NextResponse.json(
          {
            error:
              created.error ||
              "Could not create Firebase Auth account automatically. Add Service Account credentials or provide an existing Firebase Auth UID.",
          },
          { status: 400 }
        );
      }
      uid = created.uid;
    } else {
      // Set custom claims if Service Account is configured
      await adminSetCustomClaims(uid, { role, admin: true });
    }

    const now = new Date().toISOString();
    const adminDoc: AdminUser = {
      uid,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role,
      permissions: Array.isArray(permissions) ? permissions : [],
      active: true,
      createdAt: now,
      updatedAt: now,
    };

    const saved = await setDocument("admins", adminDoc as unknown as Record<string, unknown>, uid, auth.authToken);
    if (!saved.success) {
      return NextResponse.json({ error: saved.error || "Failed to save admin profile." }, { status: 500 });
    }

    await logAdminActivity(
      auth.authToken,
      auth.admin,
      "Admin Added",
      "Admin Users",
      `Super Admin ${auth.admin.email} granted ${role} role to ${email}.`,
      uid
    );

    return NextResponse.json({ success: true, item: adminDoc });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuthenticatedAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (auth.admin.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden: Only Super Admin can modify admin roles." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { uid, role, permissions, active, name } = body;
    if (!uid) return NextResponse.json({ error: "Admin UID is required." }, { status: 400 });

    // Prevent Super Admin from deactivating or demoting themselves accidentally
    if (uid === auth.admin.uid) {
      if (active === false) {
        return NextResponse.json({ error: "You cannot deactivate your own Super Admin account." }, { status: 400 });
      }
      if (role && role !== "super_admin") {
        return NextResponse.json({ error: "You cannot demote your own Super Admin role." }, { status: 400 });
      }
    }

    const updates: Record<string, unknown> = {};
    if (role) updates.role = role;
    if (Array.isArray(permissions)) updates.permissions = permissions;
    if (typeof active === "boolean") updates.active = active;
    if (name) updates.name = name;

    const updated = await updateDocument("admins", uid, updates, auth.authToken);
    if (!updated.success) {
      return NextResponse.json({ error: updated.error || "Update failed" }, { status: 500 });
    }

    if (role) {
      await adminSetCustomClaims(uid, { role, admin: true });
    }
    if (typeof active === "boolean") {
      await adminDisableAuthUser(uid, !active);
    }

    await logAdminActivity(
      auth.authToken,
      auth.admin,
      "Admin Permissions Updated",
      "Admin Users",
      `Super Admin ${auth.admin.email} updated admin ${uid} (${JSON.stringify(updates)}).`,
      uid
    );

    return NextResponse.json({ success: true, item: updated.data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update admin" }, { status: 400 });
  }
}
