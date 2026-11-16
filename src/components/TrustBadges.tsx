"use client";

import React from "react";
import { ShieldCheck, Star, Award, Calendar, RotateCcw, HeartHandshake } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export const TrustBadges: React.FC = () => {
  const { t } = useLanguage();

  const badges = [
    {
      icon: ShieldCheck,
      titleEn: "100% Satisfaction Guarantee",
      titleUr: "مکمل اطمینان کی ضمانت",
      descEn: "Change your teacher anytime at zero cost if not 100% satisfied",
      descUr: "مطمئن نہ ہونے کی صورت میں بلا فیس استاد تبدیل کرنے کی سہولت",
    },
    {
      icon: Star,
      titleEn: "4.9 / 5 Rating (200+ Families)",
      titleUr: "4.9/5 ریٹنگ (200+ خاندان)",
      descEn: "Trusted by overseas Muslim parents across the UK, USA, CA & AU",
      descUr: "برطانیہ، امریکہ اور کینیڈا کے مقیم مسلمانوں کا بااعتماد ادارہ",
    },
    {
      icon: Award,
      titleEn: "Verified Hafiz & Alim Faculty",
      titleUr: "مستند حفاظ و علمائے کرام",
      descEn: "Strictly vetted teachers with verified Sanad & Tajweed Ijazah",
      descUr: "مکمل چھان بین کے بعد منتخب شدہ بااخلاق اور مستند اساتذہ",
    },
    {
      icon: RotateCcw,
      titleEn: "Free Makeup & Rescheduling",
      titleUr: "میک اپ کلاس اور ری شیڈولنگ",
      descEn: "Easily request class reschedule when traveling or unwell",
      descUr: "سفر یا مجبوری کی صورت میں متبادل وقت پر کلاس کی سہولت",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-emerald-900/90 via-brand-deep to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-gold/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5 group">
                <div className="w-11 h-11 rounded-2xl bg-white/10 dark:bg-emerald-950/80 border border-brand-gold/40 text-brand-gold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-goldLight tracking-tight">
                    {t(b.titleEn, b.titleUr)}
                  </h4>
                  <p className="text-xs text-brand-cream/80 mt-1 leading-relaxed">
                    {t(b.descEn, b.descUr)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
