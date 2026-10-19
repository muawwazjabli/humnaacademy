"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ShieldCheck,
  Heart,
  Globe2,
  Users,
  Award,
  Sparkles,
  Calendar,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { ACADEMY_CONFIG, buildWhatsAppLink } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 py-12">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-brand-deep via-[#103b2f] to-[#0c2720] text-white p-8 sm:p-14 overflow-hidden border border-brand-gold/30 shadow-xl">
          <div className="relative max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-white/10 px-3 py-1 rounded-full border border-brand-gold/30 inline-block">
              {t("About Humna Academy", "حُمنہ اکیڈمی کا تعارف")}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              {t(
                "Nurturing Quranic Excellence with Sincerity & Modern Pedagogy",
                "اخلاص، تجوید اور جدید تدریس کے ساتھ قرآن مجید کی تعلیم"
              )}
            </h1>
            <p className="text-sm sm:text-base text-brand-cream/85 leading-relaxed">
              {t(
                "Humna Academy is an online Quran teaching institution committed to making authentic Quran recitation, Tajweed, Hifz, and Islamic Studies accessible to children, adults, and families worldwide.",
                "حُمنہ اکیڈمی ایک آن لائن تعلیمی ادارہ ہے جو دنیا بھر میں مقیم بچوں، نوجوانوں اور بڑوں کے لیے تجوید کے ساتھ ناظرہ، حفظ اور اسلامی تعلیمات کو آسان بناتا ہے۔"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-brand-border/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-emerald flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-gray-900">
              {t("Our Mission", "ہمارا مشن")}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t(
                "To deliver personalized, patient, and methodologically sound Quranic instruction to students of all backgrounds. We strive to connect hearts with the Book of Allah, ensuring students master accurate pronunciation (Makharij) and essential Islamic character without fear or frustration.",
                "ہمارا مقصد ہر طالب علم کو پیار، شفقت اور درست مخارج کے ساتھ قرآن کریم پڑھانا ہے۔ ہم طلباء کے دلوں میں کلام اللہ کی محبت پیدا کرنے اور اخلاقی تربیت پر خصوصی توجہ دیتے ہیں۔"
              )}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-brand-border/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-cream text-brand-goldDark flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-gray-900">
              {t("Our Educational Standards", "ہمارے تعلیمی اصول")}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t(
                "We uphold strict integrity: our instructors are screened for Tajweed accuracy, pedagogical patience, and reliable punctuality. We do not make exaggerated guarantees or claim unearned certifications; instead, we foster steady, measurable progress in every student.",
                "ہم شفافیت اور دیانت داری کو اولیت دیتے ہیں۔ اساتذہ کا انتخاب ان کے علم، تجوید اور حسن اخلاق کو مدنظر رکھ کر کیا جاتا ہے تاکہ ہر سبق مفید اور نتیجہ خیز ہو۔"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-brand-creamLight py-16 border-y border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-serif text-3xl font-bold text-gray-900">
              {t("What Sets Humna Academy Apart", "اکیڈمی کے بنیادی اوصاف")}
            </h2>
            <p className="text-sm text-gray-600">
              {t("Built on authentic traditional values and international online standards.", "اسلامی روایات اور جدید آن لائن تقاضوں کا حسین امتزاج۔")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-brand-border/70 shadow-sm space-y-2.5">
              <ShieldCheck className="w-6 h-6 text-brand-emerald" />
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {t("Child-Safe & Respectful Learning", "محفوظ اور حوصلہ افزا ماحول")}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t(
                  "We believe that kindness and encouragement build enduring motivation. Our teachers cultivate an environment where young learners feel celebrated.",
                  "بچوں کو پیار اور حوصلہ افزائی کے ساتھ پڑھایا جاتا ہے تاکہ وہ بغیر کسی جھجھک کے سوال کر سکیں اور سیکھیں۔"
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-border/70 shadow-sm space-y-2.5">
              <Users className="w-6 h-6 text-brand-emerald" />
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {t("Male & Female Faculty", "مرد و خواتین اساتذہ")}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t(
                  "Dedicated female teachers for sisters and young girls, ensuring complete privacy, comfort, and cultural sensitivity.",
                  "بہنوں اور بچیوں کے لیے پردے کے اہتمام کے ساتھ باصلاحیت معلمات کی سہولت دستیاب ہے۔"
                )}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-border/70 shadow-sm space-y-2.5">
              <Globe2 className="w-6 h-6 text-brand-emerald" />
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {t("Global Time Zone Flexibility", "عالمی اوقات کے مطابق کلاسز")}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t(
                  "Whether you reside in London, New York, Toronto, Sydney, or Lahore, your lessons are scheduled according to your household routine.",
                  "آپ برطانیہ، امریکہ، کینیڈا، آسٹریلیا یا پاکستان میں ہوں، کلاس کا وقت آپ کی سہولت کے مطابق طے ہوگا۔"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Credentials Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            <span>{t("Humna Academy Transparency Statement", "حُمنہ اکیڈمی کا شفافیت کا اعلان")}</span>
          </div>
          <p className="leading-relaxed">
            {t(
              "Humna Academy operates under the direct supervision of experienced Quran educators. All teacher profiles, student reviews, and official course schedules published on this platform reflect authentic operational guidelines. For specific inquiries regarding instructor sanad, curriculum selection, or customized lesson plans, our academic coordinator is directly reachable via official WhatsApp at +92 301 7291844.",
              "حُمنہ اکیڈمی کا مقصد خالص دینی تعلیم اور درست تلاوت قرآن کی ترویج ہے۔ کسی بھی قسم کی معلومات یا اساتذہ کی اسناد کے بارے میں استفسار کے لیے ہمارے واٹس ایپ نمبر پر براہ راست رابطہ کیا جا سکتا ہے۔"
            )}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-brand-deep text-white p-10 rounded-3xl space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            {t("Ready to Begin Your Learning Journey?", "کیا آپ قرآن مجید سیکھنے کے لیے تیار ہیں؟")}
          </h2>
          <p className="text-xs sm:text-sm text-brand-cream/80 max-w-xl mx-auto">
            {t(
              "Schedule your free 30-minute introductory lesson today and meet your instructor.",
              "آج ہی اپنی مفت تعارفی کلاس بک کریں اور ہمارے استاد سے رہنمائی حاصل کریں۔"
            )}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/book-trial"
              className="px-6 py-3 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-deep font-bold text-sm"
            >
              {t("Book Free Trial", "مفت ٹرائل بک کریں")}
            </Link>
            <a
              href={`https://wa.me/${ACADEMY_CONFIG.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20"
            >
              {t("Inquire on WhatsApp", "واٹس ایپ رابطہ")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
