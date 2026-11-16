"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Calendar, Sparkles } from "lucide-react";
import { ACADEMY_CONFIG, buildWhatsAppLink } from "@/lib/constants";
import { useLanguage } from "./LanguageContext";

export const MobileBottomBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#071912]/95 backdrop-blur-md border-t border-gray-200/80 dark:border-emerald-900/60 p-2.5 px-3 flex items-center gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      {/* WhatsApp Quick Chat */}
      <a
        href={buildWhatsAppLink("trial")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold text-xs shadow-sm active:scale-95 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
        <span>{t("WhatsApp", "واٹس ایپ")}</span>
      </a>

      {/* Primary Free Trial Action */}
      <Link
        href="/book-trial"
        className="flex-[1.4] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-deep via-brand-emerald to-brand-deep text-white font-bold text-xs shadow-md shadow-brand-emerald/25 active:scale-95 transition-transform"
        aria-label="Book Free Trial Class"
      >
        <Calendar className="w-4 h-4 text-brand-gold animate-pulse" />
        <span>{t("Book Free Trial", "مفت ٹرائل لیں")}</span>
      </Link>
    </div>
  );
};
