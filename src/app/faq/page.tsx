"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, CheckCircle2, AlertCircle, MessageCircle, Calendar } from "lucide-react";
import { FAQS } from "@/data/faqs";
import { buildWhatsAppLink, ACADEMY_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

export default function FAQPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Trial & Registration",
    "Courses & Learning",
    "Teachers & Scheduling",
    "Fees & Policies",
    "Technical & Contact",
  ];

  const filteredFaqs =
    selectedCategory === "All"
      ? FAQS
      : FAQS.filter((f) => f.category === selectedCategory);

  return (
    <div className="space-y-12 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {t("Clear Information", "مکمل معلومات")}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          {t("Frequently Asked Questions", "عمومی سوالات اور جوابات")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {t(
            "Find answers to common questions about free trials, curriculum choices, female teacher availability, international time zones, and academy policies.",
            "ٹرائل کلاس کے طریقہ کار، فیس، ٹائم زونز اور اساتذہ کے انتخاب سے متعلق تفصیلی رہنمائی۔"
          )}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-brand-deep text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Cards */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-2xl border border-brand-border/80 p-6 shadow-sm hover:border-brand-emerald/40 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-gray-900 leading-snug">
                  {faq.question}
                </h3>
              </div>

              {faq.isPolicyConfirmed ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-brand-emerald text-[10px] font-bold shrink-0 border border-emerald-100">
                  Confirmed Policy
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold shrink-0 border border-amber-200">
                  Awaiting Academy Confirmation
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-8">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-brand-creamLight rounded-3xl p-8 border border-brand-border/80 text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="font-serif font-bold text-xl text-gray-900">
          {t("Still Have a Specific Question?", "کوئی خاص سوال رہ گیا ہو؟")}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          {t(
            "Our academic coordinator is ready to answer questions about family discounts, custom class schedules, and syllabus matching.",
            "ہماری ٹیم واٹس ایپ پر براہ راست آپ کے سوالات کے جوابات دینے کے لیے حاضر ہے۔"
          )}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href={buildWhatsAppLink("general")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>{t("Chat on WhatsApp (+92 301 7291844)", "واٹس ایپ رابطہ")}</span>
          </a>

          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold"
          >
            {t("Visit Contact Page", "رابطہ کا صفحہ")}
          </Link>
        </div>
      </div>
    </div>
  );
}
