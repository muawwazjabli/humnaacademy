"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, BookOpen, Sparkles, Calendar, MessageCircle } from "lucide-react";
import { COURSES } from "@/data/courses";
import { CourseCard } from "@/components/CourseCard";
import { buildWhatsAppLink } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

export default function CoursesPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  const categories = [
    "All",
    "Foundation",
    "Recitation & Rules",
    "Memorization",
    "Advanced Studies",
    "Islamic Knowledge",
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  const filtered = COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.titleUrdu.includes(searchTerm) ||
      course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    const matchesLevel =
      selectedLevel === "All" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {t("Comprehensive Syllabus", "مکمل تعلیمی نصاب")}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          {t("All Quran & Islamic Education Courses", "قرآن و دینی تعلیمات کے تمام کورسز")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {t(
            "Explore our 13 specialized courses designed for children, youth, and adults. Each curriculum is tailored for one-to-one instruction with certified tutors.",
            "بچوں اور بڑوں کے لیے مرتب کردہ 13 معیاری کورسز۔ ہر کورس انفرادی کلاسز کی صورت میں پڑھایا جاتا ہے۔"
          )}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t("Search courses by name or keyword...", "کورس کا نام یا موضوع تلاش کریں...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40 transition-all"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              {t("Level:", "مرحلہ:")}
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap mr-1">
            {t("Category:", "شعبہ:")}
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-brand-deep text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          {t("Showing", "دکھائے جا رہے ہیں")}{" "}
          <strong className="text-gray-900">{filtered.length}</strong>{" "}
          {t("of 13 courses", "کورسز (کل 13)")}
        </span>
        {(searchTerm || selectedCategory !== "All" || selectedLevel !== "All") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedLevel("All");
            }}
            className="text-brand-emerald font-semibold hover:underline"
          >
            {t("Reset Filters", "فلٹرز ختم کریں")}
          </button>
        )}
      </div>

      {/* Courses Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
            {t("No courses matched your criteria", "کوئی کورس نہیں ملا")}
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {t("Try clearing search keywords or selecting 'All' categories.", "تلاش کے الفاظ بدل کر یا تمام کیٹیگریز منتخب کر کے دیکھیں")}
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedLevel("All");
            }}
            className="px-4 py-2 rounded-xl bg-brand-emerald text-white text-xs font-semibold"
          >
            {t("View All Courses", "تمام کورسز دیکھیں")}
          </button>
        </div>
      )}

      {/* Trial CTA Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-deep to-brand-emerald p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-brand-gold/30">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-serif font-bold text-xl sm:text-2xl">
            {t("Not sure which course is right for you or your child?", "سمجھ نہیں آ رہی کہ کون سا کورس آپ یا آپ کے بچے کے لیے موزوں ہے؟")}
          </h3>
          <p className="text-xs sm:text-sm text-brand-cream/80">
            {t(
              "Book a free 30-minute trial session. Our teacher will assess reading level and recommend the best starting point.",
              "مفت 30 منٹ ٹرائل لیں، ہمارے استاد موجودہ تعلیمی سطح کا جائزہ لے کر بہترین کورس تجویز کریں گے۔"
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/book-trial"
            className="px-5 py-3 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-deep font-bold text-xs sm:text-sm shadow-md"
          >
            {t("Book Free Trial", "مفت ٹرائل بک کریں")}
          </Link>
          <a
            href={buildWhatsAppLink("course")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
