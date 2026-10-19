"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export const AnnouncementBar: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-brand-deep text-brand-cream border-b border-brand-gold/20 text-xs sm:text-sm py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center justify-center p-1 rounded-full bg-brand-gold/20 text-brand-gold">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="font-medium">
            {t(
              "Free 30-Minute Trial Session Available • Flexible 1-on-1 Classes for Children & Adults",
              "مفت 30 منٹ ٹرائل کلاس دستیاب ہے • بچوں اور بڑوں کے لیے ون ٹو ون کلاسز"
            )}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/book-trial"
            className="inline-flex items-center gap-1 font-semibold text-brand-gold hover:text-brand-goldLight transition-colors underline-offset-4 hover:underline"
          >
            <span>{t("Book Free Trial", "مفت ٹرائل بک کریں")}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${language === "ur" ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </div>
    </div>
  );
};
