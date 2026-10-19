"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  MessageCircle,
  HelpCircle,
  Percent,
  RefreshCw,
  Clock,
  Sparkles
} from "lucide-react";
import {
  PRICING_PLANS,
  PRICING_CURRENCIES,
  PRICING_POLICIES,
  SupportedCurrency
} from "@/data/pricing";
import { PricingCard } from "@/components/PricingCard";
import { buildWhatsAppLink, ACADEMY_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

export default function PricingPage() {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {t("Simple & Transparent Rates", "شفاف اور آسان فیس")}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          {t("Affordable Online Quran Learning Plans", "معیاری آن لائن قرآن کلاسز کے فیس پیکجز")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {t(
            "Every plan includes a free 30-minute trial session. Fees are billed monthly with no long-term contracts. Choose the pace that best matches your family routine.",
            "ہر پیکج میں مفت 30 منٹ ٹرائل کلاس شامل ہے۔ فیس ماہانہ بنیادوں پر وصول کی جاتی ہے۔"
          )}
        </p>

        {/* Currency Switcher */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {PRICING_CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code as SupportedCurrency)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currency === c.code
                  ? "bg-brand-deep text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} currency={currency} />
        ))}
      </div>

      {/* Pricing Transparency & Payment Policy Note */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-xs text-amber-950 space-y-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>{t("Important Notice Regarding Fees & Payment Processing", "فیس اور ادائیگی سے متعلق اہم وضاحتی نوٹ")}</span>
        </div>
        <p className="leading-relaxed">
          {t(
            "The rates presented above are indicative baseline guidelines. Humna Academy does not charge credit cards directly on this website. Monthly tuition is confirmed and billed only after you complete your free trial class and confirm your designated teacher's schedule. Payment instructions are provided directly by academy administration.",
            "اوپر دی گئی فیس بنیادی رہنمائی کے لیے ہے۔ ویب سائٹ پر کارڈ سے براہ راست فیس نہیں کاٹی جاتی۔ مفت ٹرائل اور شیڈول کی تصدیق کے بعد اکیڈمی انتظامیہ ادائیگی کی ہدایات فراہم کرتی ہے۔"
          )}
        </p>
      </div>

      {/* Policies: Family Discount, Payment Methods, Refund, Rescheduling */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border/80 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            {t("Academy Policies & Discounts", "اکیڈمی کے قواعد و مراعات")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {t(
              "Clear, honest guidelines to guarantee a reliable learning partnership for your family.",
              "والدین اور طلباء کے لیے مکمل اور واضح رہنمائی۔"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Family Discount */}
          <div className="p-6 rounded-2xl bg-brand-creamLight border border-brand-border/70 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-emerald flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900">
              {t("Family & Sibling Discount", "فیملی اور بہن بھائیوں کے لیے رعایت")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {PRICING_POLICIES.familyDiscount}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="p-6 rounded-2xl bg-brand-creamLight border border-brand-border/70 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-cream text-brand-goldDark flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900">
              {t("Accepted Payment Channels", "ادائیگی کے طریقے")}
            </h3>
            <ul className="space-y-1 text-xs text-gray-600">
              {PRICING_POLICIES.paymentMethods.map((method, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  <span>{method}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Refund Policy */}
          <div className="p-6 rounded-2xl bg-brand-creamLight border border-brand-border/70 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-emerald flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900">
              {t("Satisfaction & Refund Policy", "اطمینان اور ریفنڈ پالیسی")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {PRICING_POLICIES.refundPolicy}
            </p>
          </div>

          {/* Rescheduling & Missed Classes */}
          <div className="p-6 rounded-2xl bg-brand-creamLight border border-brand-border/70 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-cream text-brand-goldDark flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900">
              {t("Missed Classes & Rescheduling", "کلاس ری شیڈول کرنے کی پالیسی")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {PRICING_POLICIES.reschedulingPolicy}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="bg-brand-deep rounded-3xl p-10 text-white text-center space-y-4 max-w-3xl mx-auto shadow-xl">
        <h3 className="font-serif font-bold text-2xl">
          {t("Start with a 100% Free Trial", "پہلے 100 فیصد مفت ٹرائل لیں")}
        </h3>
        <p className="text-xs sm:text-sm text-brand-cream/80 max-w-xl mx-auto">
          {t(
            "There is no obligation to continue. Attend your 30-minute evaluation class, assess our teacher, and decide with peace of mind.",
            "کسی پیشگی ادائیگی کی ضرورت نہیں۔ پہلے 30 منٹ کی کلاس لیں اور خود اندازہ لگائیں۔"
          )}
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/book-trial"
            className="px-6 py-3 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-deep font-bold text-xs sm:text-sm shadow-md"
          >
            {t("Book Free Trial", "مفت ٹرائل بک کریں")}
          </Link>
          <a
            href={buildWhatsAppLink("pricing")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20"
          >
            {t("WhatsApp Pricing Inquiry", "واٹس ایپ فیس معلوم کریں")}
          </a>
        </div>
      </div>
    </div>
  );
}
