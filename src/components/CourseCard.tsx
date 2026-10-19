"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, ShieldCheck, Sparkles, Award, Library, Compass, Languages, MoonStar, HeartHandshake, ArrowRight, BookOpenCheck, Bookmark, ScrollText } from "lucide-react";
import { Course } from "@/types";
import { useLanguage } from "./LanguageContext";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Award,
  Library,
  Compass,
  Languages,
  MoonStar,
  HeartHandshake,
  BookOpenCheck,
  Bookmark,
  ScrollText,
};

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const { t, language } = useLanguage();
  const IconComponent = iconMap[course.iconName] || BookOpen;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-brand-border/70 hover:border-brand-gold/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      {/* Category & Level Badges */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-brand-emerald border border-emerald-100">
          {course.category}
        </span>
        <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
          {course.level}
        </span>
      </div>

      {/* Icon & Title */}
      <div className="flex items-start gap-3.5 mb-3">
        <div className="p-3 rounded-xl bg-brand-cream/80 text-brand-deep group-hover:bg-brand-deep group-hover:text-brand-gold transition-colors shrink-0">
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-brand-emerald transition-colors">
            {t(course.title, course.titleUrdu)}
          </h3>
          {language === "en" && (
            <p className="text-xs text-brand-goldDark font-urdu mt-0.5">
              {course.titleUrdu}
            </p>
          )}
        </div>
      </div>

      {/* Short Description */}
      <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-grow leading-relaxed">
        {course.shortDescription}
      </p>

      {/* Bottom CTA */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
        <span className="text-xs text-gray-500">
          {course.suggestedLessonStructure.split(":")[0]}
        </span>
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-emerald group-hover:text-brand-deep transition-colors"
        >
          <span>{t("Learn More", "تفصیلات دیکھیں")}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${language === "ur" ? "rotate-180" : ""}`} />
        </Link>
      </div>
    </div>
  );
};
