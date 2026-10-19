"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  MessageCircle,
  Users,
  Clock,
  Sparkles,
  Award,
  Globe2,
  CheckCircle2,
  Shield,
  ArrowRight,
  HelpCircle,
  ChevronRight,
  Layers,
  Heart,
  Volume2
} from "lucide-react";
import { COURSES } from "@/data/courses";
import { TEACHER_PROFILES } from "@/data/teachers";
import { PRICING_PLANS, PRICING_CURRENCIES, SupportedCurrency } from "@/data/pricing";
import { FAQS } from "@/data/faqs";
import { CourseCard } from "@/components/CourseCard";
import { TeacherCard } from "@/components/TeacherCard";
import { PricingCard } from "@/components/PricingCard";
import { buildWhatsAppLink, ACADEMY_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>("USD");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Foundation",
    "Recitation & Rules",
    "Memorization",
    "Islamic Knowledge",
  ];

  const filteredCourses =
    selectedCategory === "All"
      ? COURSES.filter((c) => c.featured)
      : COURSES.filter((c) => c.category === selectedCategory);

  const features = [
    {
      icon: Users,
      titleEn: "One-to-One Quran Classes",
      titleUr: "ون ٹو ون انفرادی کلاسز",
      descEn: "100% personalized attention with dedicated private sessions for your child or yourself.",
      descUr: "طالب علم پر مکمل انفرادی توجہ اور نجی تعلیمی سیشنز۔",
    },
    {
      icon: Clock,
      titleEn: "Flexible International Scheduling",
      titleUr: "لچکدار بین الاقوامی اوقات",
      descEn: "Classes adapted to your exact time zone in the UK, USA, Canada, Australia, and worldwide.",
      descUr: "برطانیہ، امریکہ، کینیڈا، آسٹریلیا اور پاکستان کے مقامی ٹائم زون کے مطابق۔",
    },
    {
      icon: Shield,
      titleEn: "Male & Female Teachers",
      titleUr: "مرد و خواتین اساتذہ",
      descEn: "Qualified male and female instructors available, subject to schedule availability.",
      descUr: "بہنوں اور بچوں کے لیے مستند خواتین اساتذہ اور مرد اساتذہ دستیاب۔",
    },
    {
      icon: Award,
      titleEn: "Children & Adult Learners",
      titleUr: "بچوں اور بڑوں کی تعلیم",
      descEn: "Customized pedagogy for young kids (starting age 4-5) and separate adult tracks.",
      descUr: "چھوٹے بچوں کے لیے نرم و دلچسپ تدریس اور بڑوں کے لیے علیحدہ نصاب۔",
    },
    {
      icon: Layers,
      titleEn: "Personalized Learning Plans",
      titleUr: "انفرادی تعلیمی منصوبہ",
      descEn: "Learn at your own pace without peer pressure. Progress evaluated continuously.",
      descUr: "ہر طالب علم کی صلاحیت اور رفتار کے مطابق ذاتی تعلیمی پلان۔",
    },
    {
      icon: Globe2,
      titleEn: "Online from Anywhere",
      titleUr: "گھر بیٹھے آن لائن تعلیم",
      descEn: "Join from any smartphone, tablet, laptop, or desktop with Zoom or Google Meet.",
      descUr: "کسی بھی ڈیوائس سے باآسانی کلاس میں شرکت۔",
    },
    {
      icon: Sparkles,
      titleEn: "Free 30-Minute Trial Class",
      titleUr: "مفت جائزہ کلاس",
      descEn: "Evaluate our teaching methodology and teacher compatibility with no financial commitment.",
      descUr: "بغیر کسی پیشگی فیس کے استاد اور طریقہ تدریس کا خود جائزہ لیں۔",
    },
    {
      icon: BookOpen,
      titleEn: "Multilingual Instruction",
      titleUr: "کثیر لسانی تدریس",
      descEn: "Classes taught fluently in English, Urdu, and Arabic as confirmed by the academy.",
      descUr: "اردو اور انگریزی زبان میں آسان فہم وضاحت کے ساتھ تدریس۔",
    },
  ];

  const steps = [
    {
      number: "01",
      titleEn: "Submit Free Trial Request",
      titleUr: "مفت ٹرائل فارم پر کریں",
      descEn: "Fill out our quick trial form with your student details, course preference, and local time zone.",
      descUr: "ویب سائٹ پر طالب علم کی بنیادی معلومات اور پسندیدہ وقت درج کریں۔",
    },
    {
      number: "02",
      titleEn: "Confirm Schedule with Academy",
      titleUr: "اکیڈمی کے ساتھ وقت طے کریں",
      descEn: "Our academic coordinator contacts you via WhatsApp to match an instructor and finalize your slot.",
      descUr: "ہمارا ایڈوائزر واٹس ایپ پر رابطہ کر کے استاد اور مناسب وقت کی تصدیق کرے گا۔",
    },
    {
      number: "03",
      titleEn: "Join Class & Begin Learning",
      titleUr: "کلاس میں شامل ہو کر سفر شروع کریں",
      descEn: "Connect to your live 1-on-1 session and begin your rewarding journey with the Holy Quran.",
      descUr: "آن لائن کلاس میں شامل ہوں اور تجوید کے ساتھ تلاوت کا آغاز کریں۔",
    },
  ];

  const benefits = [
    {
      titleEn: "Flawless Pronunciation (Makharij)",
      titleUr: "مخارج کی درست ادائیگی",
      descEn: "Systematic guidance to pronounce deep Arabic letters correctly and eliminate phonetic slips.",
      descUr: "عربی حروف کو ان کے درست مخارج سے ادا کرنے کی خصوصی رہنمائی۔",
    },
    {
      titleEn: "Structured Retention & Memory",
      titleUr: "مربوط حفظ و اعادہ",
      descEn: "Classical daily revision cycles that fortify memorization and prevent verses from slipping away.",
      descUr: "روزانہ کا مربوط اعادہ جو یاد کیے گئے اسباق کو مضبوط بناتا ہے۔",
    },
    {
      titleEn: "Understanding & Spiritual Connection",
      titleUr: "فہم قرآن اور روحانی لگاؤ",
      descEn: "Gain contextual understanding of sacred verses to instill love for Islamic values and prayer.",
      descUr: "آیات کا مفہوم سمجھ کر تلاوت میں خشوع اور قلبی سکون کا حصول۔",
    },
    {
      titleEn: "Consistent Lifelong Discipline",
      titleUr: "مستقل مزاجی اور پابندی وقت",
      descEn: "Scheduled routine with a caring mentor establishes an enduring daily Quran habit at home.",
      descUr: "مشفق استاد کی نگرانی میں روزانہ تلاوت قرآن کا مستقل معمول۔",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#123F32] via-[#10382C] to-[#0A261E] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle Islamic Stars Background Pattern */}
        <div className="absolute inset-0 bg-islamic-stars opacity-40 pointer-events-none" />
        
        {/* Subtle ambient gold glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-brand-gold/30 text-xs sm:text-sm text-brand-gold font-medium">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span>
                  {t(
                    "Online Quran & Islamic Academy for Global Students",
                    "دنیا بھر کے طلباء کے لیے آن لائن قرآن اکیڈمی"
                  )}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                {t("Learn Quran Online with", "آن لائن قرآن مجید سیکھیں")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-gold">
                  Humna Academy
                </span>
              </h1>

              <p className="text-base sm:text-lg text-brand-cream/85 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {t(
                  "Learn Quran recitation, Tajweed, Hifz, and Islamic Studies with personalized online lessons designed for children and adults worldwide.",
                  "بچوں اور بڑوں کے لیے ناظرہ قرآن، تجوید، حفظ اور اسلامی تعلیمات کے انفرادی اور معیاری آن لائن اسباق۔"
                )}
              </p>

              {/* Benefit Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-2 pb-2 text-left">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="block text-brand-gold font-bold text-lg leading-tight">1-on-1</span>
                  <span className="text-[11px] sm:text-xs text-brand-cream/80">
                    {t("Personalized Focus", "مکمل انفرادی توجہ")}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="block text-brand-gold font-bold text-lg leading-tight">Flexible</span>
                  <span className="text-[11px] sm:text-xs text-brand-cream/80">
                    {t("Your Time Zone", "آپ کے وقت کے مطابق")}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="block text-brand-gold font-bold text-lg leading-tight">Free Trial</span>
                  <span className="text-[11px] sm:text-xs text-brand-cream/80">
                    {t("Zero Commitment", "بغیر کسی پیشگی فیس")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-3">
                <Link
                  href="/book-trial"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-deep font-bold text-base shadow-lg shadow-brand-gold/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Calendar className="w-5 h-5 text-brand-deep" />
                  <span>{t("Book Your Free Trial", "مفت ٹرائل کلاس حاصل کریں")}</span>
                </Link>

                <Link
                  href="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-base transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-brand-gold" />
                  <span>{t("Explore Our Courses", "ہمارے تمام کورسز دیکھیں")}</span>
                </Link>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="flex items-center gap-3 justify-center lg:justify-start text-xs text-brand-cream/70 pt-2">
                <span>{t("Prefer fast chat?", "واٹس ایپ پر فوری رابطہ؟")}</span>
                <a
                  href={`https://wa.me/${ACADEMY_CONFIG.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gold hover:underline font-semibold flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+92 301 7291844</span>
                </a>
              </div>
            </div>

            {/* Right Card / Visual representation */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-gradient-to-br from-[#1b5041] to-[#123F32] p-6 rounded-3xl border border-brand-gold/30 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none" />

                {/* Quran Verse Callout */}
                <div className="text-center p-6 bg-black/20 rounded-2xl border border-white/10 mb-6">
                  <div className="text-brand-gold font-arabic text-2xl mb-2 font-normal leading-relaxed">
                    وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
                  </div>
                  <p className="text-xs text-brand-cream/80 italic">
                    &quot;And recite the Quran with measured recitation.&quot;
                  </p>
                  <span className="text-[10px] text-brand-gold/70 uppercase tracking-widest mt-1 block">
                    Surah Al-Muzzammil 73:4
                  </span>
                </div>

                {/* Academy highlights */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="p-2 rounded-lg bg-brand-gold/20 text-brand-gold">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">13 Structured Courses</h4>
                      <p className="text-[11px] text-brand-cream/70">From Noorani Qaida to Advanced Hifz & Tafseer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Dedicated Male & Female Tutors</h4>
                      <p className="text-[11px] text-brand-cream/70">Patient, certified instructors for all age groups</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="p-2 rounded-lg bg-brand-gold/20 text-brand-gold">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Students in PK, UK, US, CA & AU</h4>
                      <p className="text-[11px] text-brand-cream/70">Flexible timings adjusted to your local clock</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                  <Link
                    href="/book-trial"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-white transition-colors"
                  >
                    <span>{t("Schedule Your Evaluation Session →", "مفت جائزہ سیشن بک کریں ←")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE HUMNA ACADEMY ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {t("Why Choose Us", "حُمنہ اکیڈمی کا انتخاب کیوں؟")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            {t("Personalized Quranic Education Built on Care & Authenticity", "مستند، معیاری اور پرخلوص تعلیمی ماحول")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {t(
              "We provide a disciplined yet nurturing environment where students of all ages build genuine love and mastery for reciting the Holy Quran.",
              "ہم ایک ایسا پرسکون اور منظم ماحول فراہم کرتے ہیں جس میں بچے اور بڑے شوق و رغبت کے ساتھ قرآن مجید پڑھنا سیکھتے ہیں۔"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-brand-border/70 p-6 shadow-sm hover:shadow-lg hover:border-brand-emerald/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-cream/80 text-brand-deep group-hover:bg-brand-deep group-hover:text-brand-gold flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-2 group-hover:text-brand-emerald transition-colors">
                  {t(item.titleEn, item.titleUr)}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t(item.descEn, item.descUr)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="bg-brand-creamLight py-20 border-y border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {t("Simple & Transparent Process", "سادہ اور آسان طریقہ کار")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
              {t("How to Get Started in 3 Steps", "کلاسز کا آغاز کیسے کریں؟")}
            </h2>
            <p className="text-sm text-gray-600">
              {t(
                "Booking a trial takes under 2 minutes. We coordinate everything directly before you make any commitment.",
                "ٹرائل فارم پر کرنے میں صرف دو منٹ لگتے ہیں۔ تمام شیڈولنگ براہ راست طے کی جاتی ہے۔"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-8 border border-brand-border/80 shadow-sm flex flex-col justify-between"
              >
                <div className="text-4xl font-extrabold text-brand-gold/30 font-serif mb-4">
                  {step.number}
                </div>
                <div className="space-y-2 mb-4">
                  <h3 className="font-serif font-bold text-xl text-gray-900">
                    {t(step.titleEn, step.titleUr)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {t(step.descEn, step.descUr)}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 text-[11px] font-medium text-brand-emerald">
                  {idx === 0 && t("No credit card required", "کسی فیس یا کارڈ کی ضرورت نہیں")}
                  {idx === 1 && t("WhatsApp / Phone matching", "براہ راست رابطہ اور تصدیق")}
                  {idx === 2 && t("Interactive one-to-one lesson", "آن لائن انفرادی سبق")}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/book-trial"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-sm font-semibold shadow-md transition-all"
            >
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span>{t("Start Step 1: Request Free Trial", "مرحلہ 1: مفت ٹرائل حاصل کریں")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== COURSE CATEGORIES ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {t("Academic Curriculum", "ہمارا تعلیمی نصاب")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              {t("Explore Our Comprehensive Courses", "ہماری کلاسز اور کورسز")}
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              {t(
                "From initial Arabic phonetics to advanced Tajweed and Tafseer, our courses cater to all levels.",
                "نورانی قاعدہ سے لے کر حفظ، تجوید اور تفسیر تک، ہر مرحلے کے لیے منظم رہنمائی۔"
              )}
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-emerald hover:text-brand-deep transition-colors self-start md:self-auto"
          >
            <span>{t("View All 13 Courses", "تمام 13 کورسز کی فہرست")}</span>
            <ArrowRight className={`w-4 h-4 ${language === "ur" ? "rotate-180" : ""}`} />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.slice(0, 6).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ===================== LEARNING BENEFITS ===================== */}
      <section className="bg-brand-deep text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-stars opacity-20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-white/10 px-3 py-1 rounded-full border border-brand-gold/30">
                {t("Structured Progression", "منظم تعلیمی فوائد")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                {t(
                  "Empowering Students with Long-Term Confidence & Recitation Accuracy",
                  "صحیح تلفظ اور اعتماد کے ساتھ تلاوتِ قرآن"
                )}
              </h2>
              <p className="text-sm text-brand-cream/80 leading-relaxed">
                {t(
                  "Structured, repetitive practice under an experienced mentor helps learners steadily overcome pronunciation hesitation and cultivate deep spiritual discipline. While individual progress depends on age and personal effort, consistent guidance makes a lasting impact.",
                  "ماہر استاد کی زیر نگرانی روزانہ مشق سے تلفظ کی جھجھک دور ہوتی ہے اور طالب علم تلاوت کے اصولوں میں مہارت حاصل کرتا ہے۔"
                )}
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:underline"
                >
                  <span>{t("Read more about our teaching approach →", "ہمارا طریقہ تدریس جانیں ←")}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-white">
                    {t(b.titleEn, b.titleUr)}
                  </h3>
                  <p className="text-xs text-brand-cream/80 leading-relaxed">
                    {t(b.descEn, b.descUr)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MEET OUR TEACHERS ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {t("Certified Faculty", "اساتذہ کرام")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            {t("Dedicated Male & Female Quran Instructors", "باصلاحیت و تجربہ کار اساتذہ")}
          </h2>
          <p className="text-sm text-gray-600">
            {t(
              "Humna Academy adheres to honest transparency: profiles shown are placeholders illustrating the qualifications, backgrounds, and criteria required of all instructors on our roster.",
              "حُمنہ اکیڈمی میں اساتذہ کا انتخاب سخت معیار اور تجوید کے امتحان کے بعد کیا جاتا ہے۔"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEACHER_PROFILES.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/teachers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-emerald hover:underline"
          >
            <span>{t("Learn about teacher selection & vetting policies →", "اساتذہ کے انتخاب کی پالیسی دیکھیں ←")}</span>
          </Link>
        </div>
      </section>

      {/* ===================== PRICING PREVIEW ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {t("Affordable & Transparent", "مناسب اور شفاف فیس")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              {t("Configurable Learning Plans", "تعلیمی پیکجز اور فیس")}
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              {t(
                "Rates below are baseline guidelines. The academy confirms final customized fees according to your family requirements and class schedule.",
                "درج ذیل فیس بنیادی رہنمائی کے لیے ہے۔ حتمی فیس شیڈول کی تصدیق کے وقت طے کی جاتی ہے۔"
              )}
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200">
            {PRICING_CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCurrency(c.code as SupportedCurrency)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCurrency === c.code
                    ? "bg-white text-brand-deep shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} currency={selectedCurrency} />
          ))}
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-brand-cream/50 border border-brand-border/60 text-center text-xs text-gray-600">
          <span>{t("Need a custom schedule (e.g. 4 days/week or 45-min lessons)?", "مخصوص شیڈول یا فیملی ڈسکاؤنٹ کے لیے؟")} </span>
          <a
            href={buildWhatsAppLink("pricing")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-emerald font-bold hover:underline"
          >
            {t("Contact us directly on WhatsApp (+92 301 7291844)", "واٹس ایپ پر رابطہ کریں (+92 301 7291844)")}
          </a>
        </div>
      </section>

      {/* ===================== TESTIMONIALS (HONEST STATUS) ===================== */}
      <section className="bg-white py-16 border-y border-brand-border/60">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-cream px-3 py-1 rounded-full border border-brand-gold/30">
            {t("Parent & Student Feedback", "طلباء اور والدین کی آراء")}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            {t("Awaiting Verified Parent & Student Reviews", "تصدیق شدہ تاثرات و آراء")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
            {t(
              "Humna Academy strictly refrains from publishing fabricated testimonials or artificial ratings. As enrolled families complete evaluation cycles, genuine verified parent and student feedback will be published here with explicit permission.",
              "حُمنہ اکیڈمی کسی قسم کے من گھڑت یا جعلی ریویوز شائع کرنے سے مکمل پرہیز کرتی ہے۔ کورسز مکمل کرنے والے طلباء اور والدین کے اصل تاثرات یہاں جلد پیش کیے جائیں گے۔"
            )}
          </p>
          <div className="pt-2">
            <span className="text-xs text-brand-emerald font-semibold">
              {t("Currently Enrolled? Share your feedback with our academic coordinator.", "کیا آپ زیرِ تعلیم ہیں؟ اپنے تاثرات واٹس ایپ پر شیئر کریں۔")}
            </span>
          </div>
        </div>
      </section>

      {/* ===================== FAQ PREVIEW ===================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {t("Clear Answers", "عمومی سوالات")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            {t("Frequently Asked Questions", "اکثر پوچھے جانے والے سوالات")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {t(
              "Clear answers regarding trial classes, time zones, female teacher requests, and policies.",
              "ٹرائل کلاس، ٹائم زونز، خواتین اساتذہ اور فیس کے متعلق تمام ضروری تفصیلات۔"
            )}
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.slice(0, 6).map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-brand-border/70 p-6 shadow-sm hover:border-brand-emerald/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-base text-gray-900">
                      {faq.question}
                    </h3>
                    {faq.isPolicyConfirmed ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-brand-emerald font-semibold">
                        Confirmed Policy
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold">
                        Subject to Academy Confirmation
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald hover:underline"
          >
            <span>{t("Browse All Frequently Asked Questions →", "تمام سوالات و جوابات دیکھیں ←")}</span>
          </Link>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-deep via-[#164e3e] to-[#123F32] p-10 sm:p-14 text-white text-center overflow-hidden shadow-2xl border border-brand-gold/30">
          <div className="absolute inset-0 bg-islamic-stars opacity-30 pointer-events-none" />
          <div className="relative max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-gold text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("Free 30-Minute Trial Session", "مفت 30 منٹ ٹرائل کلاس")}</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              {t("Start Your Quran Learning Journey Today", "آج ہی قرآن مجید سیکھنے کا مبارک سفر شروع کریں")}
            </h2>

            <p className="text-sm sm:text-base text-brand-cream/85 leading-relaxed">
              {t(
                "Experience personalized one-to-one Quran classes with qualified teachers. Book your free introductory trial or chat directly with our advisor on WhatsApp.",
                "مستند اساتذہ کے ساتھ ون ٹو ون کلاسز کا تجربہ کریں۔ اپنی مفت تعارفی ٹرائل کلاس بک کریں یا واٹس ایپ پر رابطہ کریں۔"
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/book-trial"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-deep font-bold text-sm sm:text-base shadow-lg shadow-brand-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Calendar className="w-4 h-4 text-brand-deep" />
                <span>{t("Book a Free Trial", "مفت ٹرائل بک کریں")}</span>
              </Link>

              <a
                href={buildWhatsAppLink("trial")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm sm:text-base transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{t("Contact Us on WhatsApp", "واٹس ایپ پر رابطہ کریں")}</span>
              </a>
            </div>

            <p className="text-xs text-brand-cream/60 pt-2">
              Official WhatsApp: +92 301 7291844 • International Inquiries Welcome
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
