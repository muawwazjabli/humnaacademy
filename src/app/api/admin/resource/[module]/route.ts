import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  AdminModule,
  getAuthenticatedAdmin,
  hasModulePermission,
  logAdminActivity,
  createAdminNotification,
} from "@/lib/auth-server";
import {
  deleteDocument,
  getDocument,
  listCollection,
  setDocument,
  updateDocument,
} from "@/lib/firebase-rest";

export const dynamic = "force-dynamic";

interface ModuleConfig {
  collection: string;
  permission: AdminModule;
  label: string;
  revalidatePaths?: string[];
  allowEditorDelete?: boolean;
}

const MODULE_MAP: Record<string, ModuleConfig> = {
  courses: {
    collection: "courses",
    permission: "courses",
    label: "Courses",
    revalidatePaths: ["/", "/courses"],
  },
  students: {
    collection: "students",
    permission: "students",
    label: "Students",
  },
  teachers: {
    collection: "teachers",
    permission: "teachers",
    label: "Teachers",
    revalidatePaths: ["/", "/teachers"],
  },
  "trial-requests": {
    collection: "trial_requests",
    permission: "trialRequests",
    label: "Trial Requests",
  },
  pricing: {
    collection: "pricingPlans",
    permission: "pricing",
    label: "Pricing Plans",
    revalidatePaths: ["/", "/pricing"],
  },
  blogs: {
    collection: "blogs",
    permission: "blogs",
    label: "Blog Posts",
    revalidatePaths: ["/", "/blog"],
    allowEditorDelete: false,
  },
  testimonials: {
    collection: "testimonials",
    permission: "testimonials",
    label: "Testimonials",
    revalidatePaths: ["/"],
  },
  faqs: {
    collection: "faqs",
    permission: "faqs",
    label: "FAQs",
    revalidatePaths: ["/", "/faq"],
  },
  gallery: {
    collection: "gallery",
    permission: "gallery",
    label: "Gallery",
    revalidatePaths: ["/"],
  },
  messages: {
    collection: "contactMessages",
    permission: "messages",
    label: "Contact Messages",
  },
  "website-content": {
    collection: "websiteContent",
    permission: "websiteContent",
    label: "Website Content",
    revalidatePaths: ["/", "/about", "/contact"],
  },
  settings: {
    collection: "settings",
    permission: "settings",
    label: "Website Settings",
    revalidatePaths: ["/", "/about", "/contact", "/pricing", "/courses"],
  },
  notifications: {
    collection: "notifications",
    permission: "notifications",
    label: "Notifications",
  },
  "activity-logs": {
    collection: "activityLogs",
    permission: "activityLogs",
    label: "Activity Logs",
  },
};

function revalidatePublic(paths?: string[]) {
  if (!paths) return;
  try {
    for (const p of paths) {
      revalidatePath(p);
    }
  } catch {
    // ignore revalidation errors in edge cases
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { module: string } }
) {
  const cfg = MODULE_MAP[params.module];
  if (!cfg) {
    return NextResponse.json({ error: "Unknown module" }, { status: 404 });
  }

  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasModulePermission(auth.admin, cfg.permission)) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  const idParam = req.nextUrl.searchParams.get("id");
  if (idParam) {
    const single = await getDocument(cfg.collection, idParam, auth.authToken);
    if (single.error) {
      return NextResponse.json({ error: single.error }, { status: 500 });
    }
    if (!single.doc) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ item: single.doc.data });
  }

  const res = await listCollection(cfg.collection, auth.authToken, 400);
  if (res.error) {
    return NextResponse.json({ error: res.error }, { status: 500 });
  }

  // Sort most recent first (or displayOrder ascending if present)
  const items = res.docs.map((d) => d.data);
  items.sort((a: any, b: any) => {
    if (typeof a.displayOrder === "number" && typeof b.displayOrder === "number") {
      return a.displayOrder - b.displayOrder;
    }
    const dateA = new Date(a.createdAt || a.timestamp || 0).getTime();
    const dateB = new Date(b.createdAt || b.timestamp || 0).getTime();
    return dateB - dateA;
  });

  return NextResponse.json({ items });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { module: string } }
) {
  const cfg = MODULE_MAP[params.module];
  if (!cfg) {
    return NextResponse.json({ error: "Unknown module" }, { status: 404 });
  }

  if (params.module === "activity-logs") {
    return NextResponse.json({ error: "Activity logs are append-only by the system." }, { status: 403 });
  }

  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasModulePermission(auth.admin, cfg.permission)) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const docId = body.id || body.slug || undefined;
    const now = new Date().toISOString();

    const payload = {
      ...body,
      createdBy: auth.admin.email,
      updatedBy: auth.admin.email,
      createdAt: body.createdAt || now,
      updatedAt: now,
    };

    const result = await setDocument(cfg.collection, payload, docId, auth.authToken);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save record" }, { status: 500 });
    }

    await logAdminActivity(
      auth.authToken,
      auth.admin,
      `Created ${cfg.label.slice(0, -1)}`,
      cfg.label,
      `${auth.admin.name} created/updated record in ${cfg.label} (${result.id}).`,
      result.id
    );

    if (params.module === "students") {
      await createAdminNotification(
        "student",
        "New Student Enrolled",
        `${body.fullName || "A student"} was added by ${auth.admin.name}.`,
        "/admin/students",
        result.id,
        auth.authToken
      );
    }

    revalidatePublic(cfg.revalidatePaths);
    return NextResponse.json({ success: true, id: result.id, item: result.data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid request payload" }, { status: 400 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { module: string } }
) {
  const cfg = MODULE_MAP[params.module];
  if (!cfg) {
    return NextResponse.json({ error: "Unknown module" }, { status: 404 });
  }

  if (params.module === "activity-logs") {
    return NextResponse.json({ error: "Activity logs cannot be modified." }, { status: 403 });
  }

  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasModulePermission(auth.admin, cfg.permission)) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    // Special bulk action for notifications: markAllRead
    if (params.module === "notifications" && body.action === "markAllRead") {
      const list = await listCollection("notifications", auth.authToken, 200);
      for (const doc of list.docs) {
        if (!doc.data.read) {
          await updateDocument("notifications", doc.id, { read: true }, auth.authToken);
        }
      }
      return NextResponse.json({ success: true });
    }

    if (!id) {
      return NextResponse.json({ error: "Record ID is required for update." }, { status: 400 });
    }

    const payload = {
      ...updates,
      updatedBy: auth.admin.email,
      updatedAt: new Date().toISOString(),
    };

    const result = await updateDocument(cfg.collection, id, payload, auth.authToken);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update record" }, { status: 500 });
    }

    if (params.module !== "notifications") {
      await logAdminActivity(
        auth.authToken,
        auth.admin,
        `Updated ${cfg.label}`,
        cfg.label,
        `${auth.admin.name} updated record ${id} in ${cfg.label}.`,
        id
      );
    }

    revalidatePublic(cfg.revalidatePaths);
    return NextResponse.json({ success: true, item: result.data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid request payload" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { module: string } }
) {
  const cfg = MODULE_MAP[params.module];
  if (!cfg) {
    return NextResponse.json({ error: "Unknown module" }, { status: 404 });
  }

  if (params.module === "activity-logs") {
    return NextResponse.json({ error: "Activity logs cannot be deleted." }, { status: 403 });
  }

  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasModulePermission(auth.admin, cfg.permission)) {
    return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
  }

  // Prevent editors from deleting core items if configured
  if (auth.admin.role === "editor" && cfg.allowEditorDelete === false) {
    return NextResponse.json(
      { error: "Editors do not have permission to delete records in this module." },
      { status: 403 }
    );
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Record ID is required for deletion." }, { status: 400 });
  }

  const result = await deleteDocument(cfg.collection, id, auth.authToken);
  if (!result.success) {
    return NextResponse.json({ error: result.error || "Failed to delete record" }, { status: 500 });
  }

  await logAdminActivity(
    auth.authToken,
    auth.admin,
    `Deleted ${cfg.label}`,
    cfg.label,
    `${auth.admin.name} deleted record ${id} from ${cfg.label}.`,
    id
  );

  revalidatePublic(cfg.revalidatePaths);
  return NextResponse.json({ success: true });
}
