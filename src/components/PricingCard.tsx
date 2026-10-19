"use client";

import React from "react";
import Link from "next/link";
import { Check, Calendar, MessageCircle, Sparkles } from "lucide-react";
import { PricingPlan } from "@/types";
import { SupportedCurrency, PRICING_CURRENCIES } from "@/data/pricing";
import { buildWhatsAppLink } from "@/lib/constants";
import { useLanguage } from "./LanguageContext";

interface PricingCardProps {
  plan: PricingPlan;
  currency: SupportedCurrency;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, currency }) => {
  const { t } = useLanguage();
  const currencyMeta = PRICING_CURRENCIES.find((c) => c.code === currency) || PRICING_CURRENCIES[0];
  const fee = plan.monthlyFees[currency] || plan.monthlyFees.USD;

  return (
    <div
      className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${
        plan.isPopular
          ? "bg-gradient-to-b from-white to-brand-cream/40 border-2 border-brand-gold shadow-xl scale-[1.02]"
          : "bg-white border border-brand-border/80 shadow-md hover:shadow-xl hover:border-brand-emerald/40"
      }`}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-deep to-brand-emerald text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md flex items-center gap-1.5 border border-brand-gold/40">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>{t("Most Popular", "سب سے مقبول")}</span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <h3 className="font-serif font-bold text-2xl text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-xs text-gray-500 font-medium">{plan.customPricingNote}</p>
      </div>

      {/* Price Display */}
      <div className="mb-6 p-4 rounded-2xl bg-brand-creamLight border border-brand-border/50">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-brand-emerald">{currencyMeta.symbol}</span>
          <span className="text-4xl font-extrabold tracking-tight text-gray-900">{fee}</span>
          <span className="text-xs text-gray-500 font-medium">/{t("month", "ماہانہ")}</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1">
          {plan.classesPerWeek} {t("classes/week", "کلاسز فی ہفتہ")} • {plan.durationMinutes} {t("mins/session", "منٹ فی کلاس")}
        </p>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
            <div className="p-0.5 rounded-full bg-emerald-100 text-brand-emerald shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action Buttons */}
      <div className="space-y-2 mt-auto">
        <Link
          href={`/book-trial?plan=${plan.id}`}
          className={`w-full py-3 px-4 rounded-xl text-center text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            plan.isPopular
              ? "bg-brand-deep hover:bg-brand-emerald text-white shadow-md shadow-brand-deep/20"
              : "bg-brand-emerald hover:bg-brand-deep text-white shadow-sm"
          }`}
        >
          <Calendar className="w-4 h-4 text-brand-gold" />
          <span>{t("Book Free Trial", "مفت ٹرائل لیں")}</span>
        </Link>

        <a
          href={buildWhatsAppLink("pricing", { planName: plan.name })}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>{t("Inquire on WhatsApp", "واٹس ایپ پر معلوم کریں")}</span>
        </a>
      </div>
    </div>
  );
};
