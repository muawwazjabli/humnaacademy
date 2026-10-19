import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Clock,
  ShieldCheck,
  Award,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  GraduationCap
} from "lucide-react";
import { COURSES } from "@/data/courses";
import { buildWhatsAppLink, ACADEMY_CONFIG } from "@/lib/constants";
import { Metadata } from "next";

export async function generateStaticParams() {
  return COURSES.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = COURSES.find((c) => c.slug === params.slug);
  if (!course) {
    return { title: "Course Not Found | Humna Academy" };
  }
  return {
    title: `${course.title} | Humna Academy`,
    description: course.shortDescription,
    openGraph: {
      title: `${course.title} | Humna Academy`,
      description: course.shortDescription,
    },
  };
}

export default function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = COURSES.find((c) => c.slug === params.slug);

  if (!course) {
    notFound();
  }

  const whatsappInquiryUrl = buildWhatsAppLink("course", {
    courseName: course.title,
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Back to courses navigation */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-emerald hover:text-brand-deep transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Courses</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-deep via-[#134537] to-[#0E3529] rounded-3xl p-8 sm:p-12 text-white border border-brand-gold/30 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/10 text-brand-gold text-xs font-semibold border border-brand-gold/30">
              {course.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-brand-cream text-xs font-semibold">
              Level: {course.level}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {course.title}
          </h1>

          <p className="text-sm font-urdu text-brand-goldLight text-lg sm:text-xl">
            {course.titleUrdu}
          </p>

          <p className="text-sm sm:text-base text-brand-cream/90 leading-relaxed max-w-2xl">
            {course.shortDescription}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href={`/book-trial?course=${course.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-deep font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Calendar className="w-4 h-4 text-brand-deep" />
              <span>Book Free Trial for this Course</span>
            </Link>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Verified Notice if present (e.g. for Ijazah and Qira'at) */}
      {course.verifiedNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">Academic & Transmission Notice:</span>
            <p className="leading-relaxed">{course.verifiedNote}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Overview & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Overview, Target Audience, Objectives, Curriculum */}
        <div className="lg:col-span-8 space-y-10">
          {/* Overview */}
          <section className="bg-white rounded-2xl p-8 border border-brand-border/80 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-gray-900 flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-brand-emerald" />
              <span>Course Overview</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {course.fullOverview}
            </p>
          </section>

          {/* Who is this course for */}
          <section className="bg-white rounded-2xl p-8 border border-brand-border/80 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-gray-900 flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-brand-emerald" />
              <span>Who This Course Is For</span>
            </h2>
            <ul className="space-y-2.5">
              {course.targetAudience.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Learning Objectives */}
          <section className="bg-white rounded-2xl p-8 border border-brand-border/80 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-2xl text-gray-900 flex items-center gap-2.5">
              <Award className="w-6 h-6 text-brand-emerald" />
              <span>Learning Objectives</span>
            </h2>
            <ul className="space-y-2.5">
              {course.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-brand-goldDark shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Curriculum Outline */}
          <section className="bg-white rounded-2xl p-8 border border-brand-border/80 shadow-sm space-y-6">
            <div>
              <h2 className="font-serif font-bold text-2xl text-gray-900 mb-1">
                Curriculum Outline
              </h2>
              <p className="text-xs text-gray-500">
                Paced according to the student&apos;s individual retention and practice commitment.
              </p>
            </div>

            <div className="space-y-4">
              {course.curriculum.map((mod, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 p-5 bg-brand-creamLight/40 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-brand-emerald uppercase tracking-wider">
                      {mod.weekOrModule}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-gray-900">
                    {mod.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {mod.topics.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-700 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Course Specific FAQs */}
          {course.faqs && course.faqs.length > 0 && (
            <section className="bg-white rounded-2xl p-8 border border-brand-border/80 shadow-sm space-y-4">
              <h2 className="font-serif font-bold text-2xl text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-gold" />
                <span>Frequently Asked Questions</span>
              </h2>
              <div className="space-y-3 pt-2">
                {course.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                    <h4 className="font-serif font-bold text-sm text-gray-900">{faq.question}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar: Course Parameters, Lesson Structure, Pricing CTA */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Details Card */}
          <div className="bg-white rounded-2xl p-6 border border-brand-border/80 shadow-sm space-y-5 sticky top-28">
            <h3 className="font-serif font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
              Course Details & Schedule
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-gray-400 uppercase tracking-wider block font-semibold mb-1">
                  Skill Level
                </span>
                <span className="font-medium text-gray-800 text-sm">{course.level}</span>
              </div>

              <div>
                <span className="text-gray-400 uppercase tracking-wider block font-semibold mb-1">
                  Prerequisites
                </span>
                <span className="font-medium text-gray-800 leading-relaxed block">
                  {course.prerequisites}
                </span>
              </div>

              <div>
                <span className="text-gray-400 uppercase tracking-wider block font-semibold mb-1">
                  Lesson Structure
                </span>
                <span className="font-medium text-gray-800 leading-relaxed block">
                  {course.suggestedLessonStructure}
                </span>
              </div>

              <div>
                <span className="text-gray-400 uppercase tracking-wider block font-semibold mb-1">
                  Duration & Frequency
                </span>
                <span className="font-medium text-gray-800 leading-relaxed block">
                  {course.durationFrequency}
                </span>
              </div>
            </div>

            {/* Pricing placeholder */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <span className="text-gray-400 uppercase tracking-wider block font-semibold text-[11px]">
                Fee Structure
              </span>
              <div className="p-3 bg-brand-cream/50 rounded-xl border border-brand-border/60 text-xs text-gray-700 space-y-1">
                <span className="font-bold text-brand-deep block">Configurable Monthly Plans</span>
                <p className="text-[11px] text-gray-500">
                  Customized for 2, 3, or 5 classes per week. Contact academy to confirm monthly rate for your country.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <Link
                href={`/book-trial?course=${course.slug}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-semibold shadow-md transition-colors"
              >
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span>Book Free Trial</span>
              </Link>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Coordinator</span>
              </a>
            </div>

            <p className="text-[11px] text-gray-400 text-center">
              Official WhatsApp: +92 301 7291844
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
