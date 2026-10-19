"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Sparkles,
  BookOpen,
  Filter,
} from "lucide-react";
import { TEACHER_PROFILES } from "@/data/teachers";
import { TeacherCard } from "@/components/TeacherCard";
import { buildWhatsAppLink, ACADEMY_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

export default function TeachersPage() {
  const { t } = useLanguage();
  const [filterGender, setFilterGender] = useState<string>("All");

  const filteredTeachers = TEACHER_PROFILES.filter((tProfile) => {
    if (filterGender === "All") return true;
    return tProfile.gender === filterGender;
  });

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {t("Our Instructors", "ہمارے اساتذہ")}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          {t("Qualified Male & Female Quran Teachers", "مستند مرد و خواتین اساتذہ کرام")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {t(
            "Humna Academy selects certified teachers experienced in one-to-one online instruction for children, sisters, and adult brothers. Every teacher undergoes strict background and Tajweed verification.",
            "حُمنہ اکیڈمی میں بچوں، خواتین اور مرد حضرات کے لیے تجربہ کار اور مستند اساتذہ کا انتخاب کیا جاتا ہے۔"
          )}
        </p>
      </div>

      {/* Honest Transparency Notice Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>{t("Teacher Roster & Integrity Statement", "اساتذہ کے انتخاب کی پالیسی")}</span>
        </div>
        <p className="leading-relaxed">
          {t(
            "In strict compliance with our honesty principles, profiles displayed below are structured placeholders reflecting the vetting requirements and instructional profiles maintained by Humna Academy. When you book a trial, our academic coordinator assigns a verified teacher whose schedule matches your requested time zone and preference (male/female).",
            "ہم مکمل دیانت داری پر یقین رکھتے ہیں۔ ٹرائل بک کرنے پر آپ کے منتخب کردہ وقت اور ترجیح (مرد یا خاتون استاد) کے مطابق تصدیق شدہ استاد مختص کیا جاتا ہے۔"
          )}
        </p>
      </div>

      {/* Gender Filter */}
      <div className="flex items-center justify-center gap-2">
        {["All", "Male", "Female"].map((gender) => (
          <button
            key={gender}
            onClick={() => setFilterGender(gender)}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterGender === gender
                ? "bg-brand-deep text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {gender === "All"
              ? t("All Teachers", "تمام اساتذہ")
              : gender === "Male"
              ? t("Male Teachers", "مرد اساتذہ")
              : t("Female Teachers", "خواتین اساتذہ")}
          </button>
        ))}
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>

      {/* Teacher Vetting Standards */}
      <section className="bg-brand-creamLight rounded-3xl p-8 sm:p-12 border border-brand-border/70 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            {t("Our Teacher Vetting & Selection Process", "اساتذہ کے انتخاب کا معیار")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {t(
              "We maintain an uncompromising 4-step evaluation process before any instructor is assigned to teach our students.",
              "کسی بھی استاد کو طالب علم کے ساتھ منسلک کرنے سے پہلے 4 مراحل پر مبنی جائزہ لیا جاتا ہے۔"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-brand-border/60 shadow-sm space-y-2">
            <span className="w-7 h-7 rounded-full bg-brand-deep text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-serif font-bold text-sm text-gray-900">
              {t("Tajweed & Sanad Verification", "تجوید اور سند کی تصدیق")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Thorough oral evaluation of pronunciation, Makharij accuracy, and classical certification.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border/60 shadow-sm space-y-2">
            <span className="w-7 h-7 rounded-full bg-brand-deep text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-serif font-bold text-sm text-gray-900">
              {t("Pedagogical Patience & Child Care", "بچوں کے ساتھ شفقت و تدریس")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Demonstrated ability to inspire young learners gently without harshness or pressure.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border/60 shadow-sm space-y-2">
            <span className="w-7 h-7 rounded-full bg-brand-deep text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-serif font-bold text-sm text-gray-900">
              {t("Language Fluency (English/Urdu)", "انگریزی اور اردو میں روانی")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Clear communication skills to connect naturally with international students living in the West.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border/60 shadow-sm space-y-2">
            <span className="w-7 h-7 rounded-full bg-brand-deep text-white font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h3 className="font-serif font-bold text-sm text-gray-900">
              {t("Technical & Punctuality Audit", "وقت کی پابندی اور آڈٹ")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              High-speed internet, noise-canceling headsets, and consistent attendance monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center bg-white rounded-3xl p-10 border border-brand-border/80 shadow-sm space-y-4 max-w-3xl mx-auto">
        <h3 className="font-serif font-bold text-2xl text-gray-900">
          {t("Request Your Preferred Teacher Today", "اپنے پسندیدہ استاد کی درخواست کریں")}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          {t(
            "Tell us your child or student preferences (male or female, English or Urdu, specific timing) and we will arrange the trial class.",
            "ہمیں اپنی پسند اور اوقات بتائیں، ہم جلد از جلد ٹرائل کلاس کا اہتمام کریں گے۔"
          )}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/book-trial"
            className="px-6 py-3 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs sm:text-sm font-semibold"
          >
            {t("Book Free Trial", "مفت ٹرائل بک کریں")}
          </Link>
          <a
            href={buildWhatsAppLink("general", { customMessage: "Assalamu Alaikum Humna Academy, I would like to inquire about teacher schedules and availability." })}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold"
          >
            {t("Inquire on WhatsApp", "واٹس ایپ پر پوچھیں")}
          </a>
        </div>
      </div>
    </div>
  );
}
