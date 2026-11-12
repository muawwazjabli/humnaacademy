import { listCollection, getDocument } from "./firebase-rest";
import { getAdminAccessToken } from "./firebase-admin-sdk";
import { isFirebaseConfigured } from "./firebase";
import { COURSES } from "@/data/courses";
import { TEACHER_PROFILES } from "@/data/teachers";
import { PRICING_PLANS } from "@/data/pricing";
import { BLOG_POSTS } from "@/data/blog";
import { FAQS } from "@/data/faqs";
import { DEFAULT_WEBSITE_CONTENT, DEFAULT_WEBSITE_SETTINGS } from "./default-content";
import {
  BlogPost,
  Course,
  FAQItem,
  GalleryItem,
  PricingPlan,
  TeacherProfile,
  TestimonialRecord,
  WebsiteContentData,
  WebsiteSettingsData,
} from "@/types";

export interface PublicSiteBundle {
  courses: Course[];
  teachers: TeacherProfile[];
  pricingPlans: PricingPlan[];
  blogs: BlogPost[];
  faqs: FAQItem[];
  testimonials: TestimonialRecord[];
  gallery: GalleryItem[];
  websiteContent: WebsiteContentData;
  settings: WebsiteSettingsData;
  isLiveFirebase: boolean;
}

function sortByOrder<T extends { displayOrder?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
}

export async function fetchPublicSiteBundle(): Promise<PublicSiteBundle> {
  if (!isFirebaseConfigured()) {
    return {
      courses: COURSES,
      teachers: TEACHER_PROFILES,
      pricingPlans: PRICING_PLANS,
      blogs: BLOG_POSTS,
      faqs: FAQS,
      testimonials: [],
      gallery: [],
      websiteContent: DEFAULT_WEBSITE_CONTENT,
      settings: DEFAULT_WEBSITE_SETTINGS,
      isLiveFirebase: false,
    };
  }

  try {
    const token = (await getAdminAccessToken()) || undefined;

    const [
      coursesRes,
      teachersRes,
      pricingRes,
      blogsRes,
      faqsRes,
      testimonialsRes,
      galleryRes,
      contentRes,
      settingsRes,
    ] = await Promise.all([
      listCollection<Course>("courses", token, 100),
      listCollection<TeacherProfile>("teachers", token, 100),
      listCollection<PricingPlan>("pricingPlans", token, 50),
      listCollection<BlogPost>("blogs", token, 100),
      listCollection<FAQItem>("faqs", token, 150),
      listCollection<TestimonialRecord>("testimonials", token, 100),
      listCollection<GalleryItem>("gallery", token, 100),
      getDocument<WebsiteContentData>("websiteContent", "main", token),
      getDocument<WebsiteSettingsData>("settings", "general", token),
    ]);

    const rawCourses = coursesRes.docs.map((d) => d.data);
    const courses =
      rawCourses.length > 0
        ? sortByOrder(rawCourses.filter((c) => c.status !== "draft"))
        : COURSES;

    const rawTeachers = teachersRes.docs.map((d) => d.data);
    const teachers =
      rawTeachers.length > 0
        ? sortByOrder(rawTeachers.filter((t) => t.status === "published" && t.active !== false))
        : TEACHER_PROFILES;

    const rawPricing = pricingRes.docs.map((d) => d.data);
    const pricingPlans =
      rawPricing.length > 0
        ? sortByOrder(rawPricing.filter((p) => p.status !== "draft"))
        : PRICING_PLANS;

    const rawBlogs = blogsRes.docs.map((d) => d.data);
    const blogs =
      rawBlogs.length > 0
        ? rawBlogs.filter((b) => b.status !== "draft")
        : BLOG_POSTS;

    const rawFaqs = faqsRes.docs.map((d) => d.data);
    const faqs =
      rawFaqs.length > 0
        ? sortByOrder(rawFaqs.filter((f) => f.status !== "draft"))
        : FAQS;

    const testimonials = testimonialsRes.docs
      .map((d) => d.data)
      .filter((t) => t.status === "published" && t.approvalStatus === "approved");

    const gallery = sortByOrder(
      galleryRes.docs.map((d) => d.data).filter((g) => g.status === "published")
    );

    const websiteContent = contentRes.doc
      ? {
          ...DEFAULT_WEBSITE_CONTENT,
          ...contentRes.doc.data,
          hero: { ...DEFAULT_WEBSITE_CONTENT.hero, ...(contentRes.doc.data.hero || {}) },
          announcement: {
            ...DEFAULT_WEBSITE_CONTENT.announcement,
            ...(contentRes.doc.data.announcement || {}),
          },
          about: { ...DEFAULT_WEBSITE_CONTENT.about, ...(contentRes.doc.data.about || {}) },
        }
      : DEFAULT_WEBSITE_CONTENT;

    const settings = settingsRes.doc
      ? {
          ...DEFAULT_WEBSITE_SETTINGS,
          ...settingsRes.doc.data,
          social: {
            ...DEFAULT_WEBSITE_SETTINGS.social,
            ...(settingsRes.doc.data.social || {}),
          },
        }
      : DEFAULT_WEBSITE_SETTINGS;

    return {
      courses,
      teachers,
      pricingPlans,
      blogs,
      faqs,
      testimonials,
      gallery,
      websiteContent,
      settings,
      isLiveFirebase: true,
    };
  } catch (err) {
    console.warn("Falling back to static public data:", err);
    return {
      courses: COURSES,
      teachers: TEACHER_PROFILES,
      pricingPlans: PRICING_PLANS,
      blogs: BLOG_POSTS,
      faqs: FAQS,
      testimonials: [],
      gallery: [],
      websiteContent: DEFAULT_WEBSITE_CONTENT,
      settings: DEFAULT_WEBSITE_SETTINGS,
      isLiveFirebase: false,
    };
  }
}
