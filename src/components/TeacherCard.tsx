"use client";

import React from "react";
import Link from "next/link";
import { User, CheckCircle2, Clock, Globe2, Sparkles, MessageCircle } from "lucide-react";
import { TeacherProfile } from "@/types";
import { buildWhatsAppLink } from "@/lib/constants";
import { useLanguage } from "./LanguageContext";

export const TeacherCard: React.FC<{ teacher: TeacherProfile }> = ({ teacher }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-brand-border/80 hover:border-brand-gold/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
      {/* Honest Placeholder Notice Badge */}
      {teacher.isPlaceholder && (
        <div className="absolute top-0 right-0 left-0 bg-brand-cream/80 text-brand-deep text-[11px] font-medium py-1 px-4 text-center border-b border-brand-gold/20">
          {t("Placeholder Profile • Verified Roster Configured by Academy", "اکیڈمی کی تصدیق شدہ اساتذہ لسٹ")}
        </div>
      )}

      {/* Header with avatar placeholder */}
      <div className="flex items-start gap-4 mb-4 mt-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-deep to-brand-emerald text-brand-gold flex items-center justify-center shrink-0 shadow-md">
          <User className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-brand-emerald">
              {teacher.gender} Teacher
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{teacher.experienceYears}</span>
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-brand-emerald transition-colors mt-0.5">
            {teacher.name}
          </h3>
          <p className="text-xs text-brand-goldDark font-medium">{teacher.title}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-4 leading-relaxed italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
        &quot;{teacher.bio}&quot;
      </p>

      {/* Qualifications */}
      <div className="space-y-1.5 mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {t("Qualifications & Criteria", "تعلیمی اسناد")}
        </span>
        <ul className="space-y-1">
          {teacher.qualifications.map((q, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0 mt-0.5" />
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Specialization Tags */}
      <div className="mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
          {t("Specializations", "مہارت")}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {teacher.specialization.map((spec, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-brand-cream/60 text-brand-deep text-[11px] font-medium"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Languages & Availability */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-6 pt-3 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-brand-gold" />
          <span className="truncate">{teacher.languages.join(", ")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-gold" />
          <span className="truncate">{t("Flexible Slots", "لچکدار اوقات")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/book-trial"
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Sparkles className="w-3 h-3 text-brand-gold" />
          <span>{t("Request Teacher", "استاد کی درخواست")}</span>
        </Link>
        <a
          href={buildWhatsAppLink("general", { customMessage: `Assalamu Alaikum Humna Academy, I would like to inquire about teacher availability for ${teacher.title}.` })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t("Inquire", "معلومات")}</span>
        </a>
      </div>
    </div>
  );
};
