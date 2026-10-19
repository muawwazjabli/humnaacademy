"use client";

import React, { useState } from "react";
import { MessageCircle, X, Sparkles, BookOpen, CreditCard, HelpCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/constants";
import { useLanguage } from "./LanguageContext";

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const options = [
    {
      titleEn: "Free Trial Request",
      titleUr: "مفت ٹرائل درخواست",
      descEn: "Schedule your free 30-min evaluation class",
      descUr: "اپنی 30 منٹ کی مفت جائزہ کلاس طے کریں",
      icon: Sparkles,
      url: buildWhatsAppLink("trial"),
    },
    {
      titleEn: "Course Inquiries",
      titleUr: "کورسز کی معلومات",
      descEn: "Ask about Qaida, Nazra, Tajweed, or Hifz",
      descUr: "قاعدہ، ناظرہ، تجوید یا حفظ کے بارے میں معلوم کریں",
      icon: BookOpen,
      url: buildWhatsAppLink("course"),
    },
    {
      titleEn: "Fee & Pricing Details",
      titleUr: "فیس اور پیکجز",
      descEn: "Get fee structures for PK, UK, US, CA & AU",
      descUr: "پاکستان اور بیرون ممالک کے فیس پیکجز",
      icon: CreditCard,
      url: buildWhatsAppLink("pricing"),
    },
    {
      titleEn: "General Assistance",
      titleUr: "عمومی رہنمائی",
      descEn: "Chat directly with our academic advisor",
      descUr: "ہمارے اکیڈمک ایڈوائزر سے براہ راست بات کریں",
      icon: HelpCircle,
      url: buildWhatsAppLink("general"),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Menu */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden animate-fadeIn transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-deep to-brand-emerald p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Humna Academy WhatsApp</h4>
                <p className="text-[11px] text-brand-cream/80">+92 301 7291844 • Online Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Close WhatsApp Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Options */}
          <div className="p-3 bg-brand-creamLight/50 divide-y divide-gray-100">
            {options.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <a
                  key={idx}
                  href={opt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-emerald-50 text-brand-emerald group-hover:bg-brand-emerald group-hover:text-white transition-colors mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 group-hover:text-brand-emerald">
                      {t(opt.titleEn, opt.titleUr)}
                    </div>
                    <div className="text-[11px] text-gray-500 line-clamp-1">
                      {t(opt.descEn, opt.descUr)}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="p-2.5 bg-gray-50 text-center border-t border-gray-100">
            <span className="text-[11px] text-gray-500">
              {t("Direct inquiries answered by our academic team", "تمام پیغامات کے جوابات ہماری اکیڈمک ٹیم دیتی ہے")}
            </span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all group focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="hidden sm:inline font-semibold text-sm">
          {isOpen ? t("Close", "بند کریں") : t("Chat on WhatsApp", "واٹس ایپ رابطہ")}
        </span>
      </button>
    </div>
  );
};
