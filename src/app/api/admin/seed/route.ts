import { NextResponse } from "next/server";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth-server";
import { getDocument, listCollection, setDocument } from "@/lib/firebase-rest";
import { COURSES } from "@/data/courses";
import { PRICING_PLANS } from "@/data/pricing";
import { BLOG_POSTS } from "@/data/blog";
import { FAQS } from "@/data/faqs";
import { TEACHER_PROFILES } from "@/data/teachers";
import { DEFAULT_WEBSITE_CONTENT, DEFAULT_WEBSITE_SETTINGS } from "@/lib/default-content";

export async function POST() {
  const auth = await getAuthenticatedAdmin();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (auth.admin.role !== "super_admin" && auth.admin.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = auth.authToken;
  const now = new Date().toISOString();
  const seeded: Record<string, number> = {
    courses: 0,
    pricingPlans: 0,
    blogs: 0,
    faqs: 0,
    teachers: 0,
    websiteContent: 0,
    settings: 0,
  };

  try {
    // 1. Seed Courses if missing
    const existingCourses = await listCollection("courses", token, 100);
    const existingCourseIds = new Set(existingCourses.docs.map((d) => d.id));
    for (let i = 0; i < COURSES.length; i++) {
      const c = COURSES[i];
      if (!existingCourseIds.has(c.id)) {
        await setDocument(
          "courses",
          {
            ...c,
            status: "published",
            displayOrder: i + 1,
            createdAt: now,
            updatedAt: now,
          },
          c.id,
          token
        );
        seeded.courses++;
      }
    }

    // 2. Seed Pricing Plans if missing
    const existingPlans = await listCollection("pricingPlans", token, 50);
    const existingPlanIds = new Set(existingPlans.docs.map((d) => d.id));
    for (let i = 0; i < PRICING_PLANS.length; i++) {
      const p = PRICING_PLANS[i];
      if (!existingPlanIds.has(p.id)) {
        await setDocument(
          "pricingPlans",
          {
            ...p,
            status: "published",
            displayOrder: i + 1,
            createdAt: now,
            updatedAt: now,
          },
          p.id,
          token
        );
        seeded.pricingPlans++;
      }
    }

    // 3. Seed Blogs if missing
    const existingBlogs = await listCollection("blogs", token, 100);
    const existingBlogIds = new Set(existingBlogs.docs.map((d) => d.id));
    for (const b of BLOG_POSTS) {
      if (!existingBlogIds.has(b.slug)) {
        await setDocument(
          "blogs",
          {
            ...b,
            id: b.slug,
            status: "published",
            createdAt: now,
            updatedAt: now,
          },
          b.slug,
          token
        );
        seeded.blogs++;
      }
    }

    // 4. Seed FAQs if missing
    const existingFaqs = await listCollection("faqs", token, 100);
    const existingFaqIds = new Set(existingFaqs.docs.map((d) => d.id));
    for (let i = 0; i < FAQS.length; i++) {
      const f = FAQS[i];
      if (!existingFaqIds.has(f.id)) {
        await setDocument(
          "faqs",
          {
            ...f,
            status: "published",
            displayOrder: i + 1,
            createdAt: now,
            updatedAt: now,
          },
          f.id,
          token
        );
        seeded.faqs++;
      }
    }

    // 5. Seed Teachers (only if empty, preserving placeholder notice)
    const existingTeachers = await listCollection("teachers", token, 50);
    if (existingTeachers.docs.length === 0) {
      for (let i = 0; i < TEACHER_PROFILES.length; i++) {
        const tp = TEACHER_PROFILES[i];
        await setDocument(
          "teachers",
          {
            ...tp,
            status: "draft", // Placeholders remain draft until real verified profiles are published
            active: false,
            displayOrder: i + 1,
            createdAt: now,
            updatedAt: now,
          },
          tp.id,
          token
        );
        seeded.teachers++;
      }
    }

    // 6. Seed Website Content singleton
    const contentDoc = await getDocument("websiteContent", "main", token);
    if (!contentDoc.doc) {
      await setDocument(
        "websiteContent",
        { ...DEFAULT_WEBSITE_CONTENT, id: "main", updatedAt: now },
        "main",
        token
      );
      seeded.websiteContent++;
    }

    // 7. Seed Settings singleton
    const settingsDoc = await getDocument("settings", "general", token);
    if (!settingsDoc.doc) {
      await setDocument(
        "settings",
        { ...DEFAULT_WEBSITE_SETTINGS, id: "general", updatedAt: now },
        "general",
        token
      );
      seeded.settings++;
    }

    await logAdminActivity(
      token,
      auth.admin,
      "Initialized Default Content",
      "System",
      `Synced missing default content into Firestore: ${JSON.stringify(seeded)}.`
    );

    return NextResponse.json({ success: true, seeded });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: err?.message || "Failed to initialize data" }, { status: 500 });
  }
}
