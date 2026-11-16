"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  User,
  ArrowRight,
  ArrowLeft,
  Globe2,
  Check,
} from "lucide-react";
import { COMMON_TIMEZONES, TEACHING_LANGUAGES, ACADEMY_CONFIG, buildWhatsAppLink } from "@/lib/constants";
import { TrialBookingPayload } from "@/types";
import { useLanguage } from "./LanguageContext";
import { usePublicData } from "./PublicDataContext";

export const TrialBookingForm: React.FC = () => {
  const { t, language } = useLanguage();
  const { courses } = usePublicData();
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("course") || "";

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState<TrialBookingPayload>({
    fullName: "",
    ageGroup: "child",
    studentAge: "",
    parentName: "",
    email: "",
    whatsappNumber: "",
    country: "",
    preferredCourse: initialCourse || courses[0]?.title || "Quran Reading Course (Nazra)",
    readingLevel: "Complete Beginner",
    preferredTeacher: "no_preference",
    preferredLanguage: "English",
    preferredDays: ["Monday", "Wednesday", "Friday"],
    preferredTime: "Evening (5:00 PM - 9:00 PM)",
    timeZone: "Europe/London",
    additionalMessage: "",
    consentAgreed: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    referenceId: string;
    isPersistedToDatabase: boolean;
    mode: string;
    message: string;
  } | null>(null);

  const daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      const exists = prev.preferredDays.includes(day);
      const updated = exists
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day];
      return { ...prev, preferredDays: updated };
    });
  };

  const validateStep = (step: number) => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.preferredCourse) {
        setErrorMessage(t("Please select a course to continue.", "براہ کرم کورس کا انتخاب کریں۔"));
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (formData.preferredDays.length === 0) {
        setErrorMessage(t("Please select at least one preferred day.", "براہ کرم کم از کم ایک دن منتخب کریں۔"));
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
    }
  };

  const prevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage(t("Please enter the student or parent name.", "براہ کرم نام درج کریں۔"));
      return;
    }

    if (!formData.whatsappNumber.trim()) {
      setErrorMessage(t("Please enter a valid WhatsApp or contact phone number.", "براہ کرم رابطہ نمبر یا واٹس ایپ نمبر درج کریں۔"));
      return;
    }

    if (!formData.consentAgreed) {
      setErrorMessage(t("Please agree to the privacy policy to proceed.", "براہ کرم پرائیویسی پالیسی سے اتفاق کریں۔"));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/trial-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Submission failed. Please try again.");
      }

      setSubmissionResult({
        referenceId: json.referenceId,
        isPersistedToDatabase: json.isPersistedToDatabase,
        mode: json.mode,
        message: json.message,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error. Please try again or message us on WhatsApp.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const lines = [
      `*Humna Academy - Free Trial Request*`,
      `Reference: ${submissionResult?.referenceId || "Direct Booking"}`,
      `Student Name: ${formData.fullName}`,
      `Age Group: ${formData.ageGroup === "child" ? "Child" : "Adult"}`,
      formData.parentName ? `Parent Name: ${formData.parentName}` : "",
      `WhatsApp: ${formData.whatsappNumber}`,
      formData.country ? `Country: ${formData.country}` : "",
      `Preferred Course: ${formData.preferredCourse}`,
      `Current Level: ${formData.readingLevel}`,
      `Preferred Teacher: ${formData.preferredTeacher}`,
      `Preferred Language: ${formData.preferredLanguage}`,
      `Preferred Days: ${formData.preferredDays.join(", ")}`,
      `Preferred Time: ${formData.preferredTime}`,
      `Time Zone: ${formData.timeZone}`,
      formData.additionalMessage ? `Message: ${formData.additionalMessage}` : "",
    ].filter(Boolean);

    return `https://wa.me/${ACADEMY_CONFIG.whatsappRaw}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
  };

  // Success State View
  if (submissionResult) {
    return (
      <div className="bg-white dark:bg-[#0b231b] rounded-3xl p-8 sm:p-12 border border-brand-border/80 dark:border-emerald-800 shadow-xl max-w-2xl mx-auto space-y-6 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-brand-emerald dark:text-brand-gold flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald dark:text-brand-gold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800 inline-block">
            {submissionResult.isPersistedToDatabase
              ? "Saved to Academy Database"
              : "Demo Mode • Request Prepared"}
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("Trial Request Submitted Successfully!", "ٹرائل کلاس کی درخواست موصول ہوگئی ہے!")}
          </h2>

          <p className="text-xs text-gray-500 font-mono">
            Booking Reference ID: <strong className="text-gray-900 dark:text-brand-gold">{submissionResult.referenceId}</strong>
          </p>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto">
          {submissionResult.message}
        </p>

        {/* WhatsApp Forward Action */}
        <div className="p-5 bg-brand-cream/60 dark:bg-emerald-950/40 rounded-2xl border border-brand-border/70 dark:border-emerald-800 space-y-3 text-left">
          <div className="flex items-center gap-2 text-brand-deep dark:text-brand-gold font-semibold text-xs sm:text-sm">
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t("Instant WhatsApp Teacher Assignment", "واٹس ایپ پر فوری استاد کا انتخاب")}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {t(
              "You can forward your booking summary directly to our official WhatsApp (+92 301 7291844) to get assigned to a teacher immediately.",
              "فوری کلاس شیڈول کروانے کے لیے آپ اپنی درخواست ہمارے آفیشل واٹس ایپ پر ایک کلک سے بھیج سکتے ہیں۔"
            )}
          </p>
          <a
            href={generateWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t("Send Booking to WhatsApp (+92 301 7291844)", "واٹس ایپ پر بھیجیں")}</span>
          </a>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              setSubmissionResult(null);
              setCurrentStep(1);
            }}
            className="text-xs text-brand-emerald dark:text-brand-gold hover:underline font-semibold"
          >
            {t("Submit Another Trial Request", "ایک اور درخواست دیں")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick 1-Click WhatsApp Booking Box (High Conversion Option) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50/50 dark:from-emerald-950/50 dark:to-amber-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
              {t("Short on time? Book directly via WhatsApp!", "فارم بھرنے کی ضرورت نہیں؟ فوری واٹس ایپ پر بک کریں!")}
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
              {t("Chat 1-on-1 with our academic coordinator in under 1 minute.", "ہمارے کوآرڈینیٹر سے براہ راست بات کر کے 1 منٹ میں ٹرائل طے کریں۔")}
            </p>
          </div>
        </div>
        <a
          href={buildWhatsAppLink("trial")}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shrink-0 transition-transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>{t("Instant WhatsApp Booking", "واٹس ایپ پر ٹرائل لیں")}</span>
        </a>
      </div>

      {/* Main Multi-Step Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#0b231b] rounded-3xl p-6 sm:p-10 border border-brand-border/80 dark:border-emerald-800 shadow-xl space-y-6"
      >
        {/* Step Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={`${currentStep >= 1 ? "text-brand-emerald dark:text-brand-gold font-bold" : "text-gray-400"}`}>
              {t("1. Course & Goals", "1. کورس کا انتخاب")}
            </span>
            <span className={`${currentStep >= 2 ? "text-brand-emerald dark:text-brand-gold font-bold" : "text-gray-400"}`}>
              {t("2. Schedule & Time", "2. کلاس شیڈول")}
            </span>
            <span className={`${currentStep >= 3 ? "text-brand-emerald dark:text-brand-gold font-bold" : "text-gray-400"}`}>
              {t("3. Contact Details", "3. رابطہ اور تصدیق")}
            </span>
          </div>

          <div className="w-full bg-gray-100 dark:bg-emerald-950/60 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-brand-deep to-brand-emerald h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Academic & Course Preferences */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-100 dark:border-emerald-900 pb-2">
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                {t("Step 1: Choose Your Learning Path", "پہلا مرحلہ: کورس اور طالب علم کی تفصیل")}
              </h3>
              <p className="text-xs text-gray-500">
                {t("Tell us who will be taking the class and what subject they want to learn.", "بتائیے کہ کون پڑھنا چاہتا ہے اور کون سا کورس منتخب کرنا ہے۔")}
              </p>
            </div>

            {/* Age Group Switch */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                {t("Who is this class for? *", "یہ کلاس کس کے لیے ہے؟ *")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, ageGroup: "child" })}
                  className={`p-3.5 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    formData.ageGroup === "child"
                      ? "bg-brand-deep text-white border-brand-deep shadow-md"
                      : "bg-gray-50 dark:bg-[#081d16] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-emerald-900 hover:border-brand-emerald"
                  }`}
                >
                  <div>
                    <span className="block font-bold">{t("Child / Student", "بچہ یا نوجوان")}</span>
                    <span className="text-[11px] opacity-80">{t("Ages 4 to 16 Years", "عمر 4 تا 16 سال")}</span>
                  </div>
                  {formData.ageGroup === "child" && <Check className="w-4 h-4 text-brand-gold" />}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, ageGroup: "adult" })}
                  className={`p-3.5 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                    formData.ageGroup === "adult"
                      ? "bg-brand-deep text-white border-brand-deep shadow-md"
                      : "bg-gray-50 dark:bg-[#081d16] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-emerald-900 hover:border-brand-emerald"
                  }`}
                >
                  <div>
                    <span className="block font-bold">{t("Adult / Self", "بالغ (خود پڑھنا ہے)")}</span>
                    <span className="text-[11px] opacity-80">{t("Ages 17+ Years", "عمر 17 سال یا زائد")}</span>
                  </div>
                  {formData.ageGroup === "adult" && <Check className="w-4 h-4 text-brand-gold" />}
                </button>
              </div>
            </div>

            {/* Course Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("Selected Course *", "پسندیدہ کورس *")}
              </label>
              <select
                value={formData.preferredCourse}
                onChange={(e) => setFormData({ ...formData, preferredCourse: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Reading Level */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("Current Quran Reading Level", "موجودہ قرآنی قابلیت")}
              </label>
              <select
                value={formData.readingLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    readingLevel: e.target.value as TrialBookingPayload["readingLevel"],
                  })
                }
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
              >
                <option value="Complete Beginner">{t("Complete Beginner (Cannot recognize Arabic letters)", "بالکل ابتدائی (حروف کی پہچان نہیں)")}</option>
                <option value="Can read letters">{t("Can recognize individual letters (Needs Qaida practice)", "حروف پہچان سکتا ہے (قاعدہ شروع کرنا ہے)")}</option>
                <option value="Slow reading">{t("Can read slowly with hesitation (Needs Nazra fluency)", "آہستہ پڑھتا ہے (ناظرہ میں روانی چاہیے)")}</option>
                <option value="Fluent">{t("Can read fluently, needs Tajweed correction", "روانی ہے مگر تجوید اور مخارج کی اصلاح چاہیے")}</option>
                <option value="Advanced">{t("Advanced / Hifz (Memorization) Track", "حفظ یا ایڈوانس تلاوت")}</option>
              </select>
            </div>

            {/* Teaching Language */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("Preferred Teaching Language", "تدریس کی زبان")}
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
              >
                {TEACHING_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <span>{t("Continue to Schedule", "اگلا مرحلہ: وقت اور دن")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Schedule & Time Preferences */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-100 dark:border-emerald-900 pb-2">
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                {t("Step 2: Class Timings & Instructor", "دوسرا مرحلہ: کلاس کے اوقات اور استاد")}
              </h3>
              <p className="text-xs text-gray-500">
                {t("We adjust classes 100% to your local international time zone.", "ہم کلاسز مکمل طور پر آپ کے مقامی ٹائم زون کے مطابق طے کرتے ہیں۔")}
              </p>
            </div>

            {/* Time Zone */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("Your Local Time Zone *", "آپ کا مقامی ٹائم زون *")}
              </label>
              <select
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Days Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("Preferred Days of the Week *", "پسندیدہ دن *")}
              </label>
              <div className="flex flex-wrap gap-2">
                {daysList.map((day) => {
                  const selected = formData.preferredDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selected
                          ? "bg-brand-emerald text-white border-brand-emerald shadow-sm"
                          : "bg-gray-50 dark:bg-[#081d16] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-emerald-900 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Time Window */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("Preferred Time Window (in your local time)", "پسندیدہ وقت کا دورانیہ")}
              </label>
              <input
                type="text"
                placeholder={t("e.g. 5:00 PM - 7:00 PM or Weekend Mornings", "مثلاً شام 5 سے 7 بجے")}
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
              />
            </div>

            {/* Teacher Gender Preference */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("Teacher Preference", "استاد کا انتخاب")}
              </label>
              <select
                value={formData.preferredTeacher}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredTeacher: e.target.value as TrialBookingPayload["preferredTeacher"],
                  })
                }
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
              >
                <option value="no_preference">{t("No Preference (Best available tutor)", "کوئی ترجیح نہیں (بہترین دستیاب قاری)")}</option>
                <option value="female">{t("Female Teacher (For sisters & young children)", "خاتون معلمہ (بہنوں اور بچوں کے لیے)")}</option>
                <option value="male">{t("Male Teacher (Qari)", "قاری صاحب (مرد استاد)")}</option>
              </select>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t("Back", "پیچھے")}</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <span>{t("Continue to Contact Details", "اگلا مرحلہ: رابطہ اور نام")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Contact Details & Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="border-b border-gray-100 dark:border-emerald-900 pb-2">
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                {t("Step 3: Confirm Your Free Trial", "آخری مرحلہ: رابطہ اور تصدیق")}
              </h3>
              <p className="text-xs text-gray-500">
                {t("Where should our coordinator send your class link and schedule?", "کلاس کا لنک اور وقت کس واٹس ایپ نمبر پر بھیجا جائے؟")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("Student Full Name *", "طالب علم کا مکمل نام *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abdullah / Fatima"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
                />
              </div>

              {formData.ageGroup === "child" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("Parent / Guardian Name", "والد یا سرپرست کا نام")}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Ahmed"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("WhatsApp Number (with country code) *", "واٹس ایپ نمبر (ملکی کوڈ کے ساتھ) *")}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +44 7123 456789 or +92 300 1234567"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("Country", "ملک")}
                </label>
                <input
                  type="text"
                  placeholder="e.g. UK, USA, Canada"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("Email Address (Optional)", "ای میل ایڈریس (اختیاری)")}
              </label>
              <input
                type="email"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t("Special Requests or Message (Optional)", "کوئی خاص سوال یا پیغام")}
              </label>
              <textarea
                rows={2}
                placeholder={t("Any specific requests or requirements...", "کوئی خاص ہدایت...")}
                value={formData.additionalMessage}
                onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-800 text-sm bg-gray-50 dark:bg-[#081d16] focus:ring-2 focus:ring-brand-emerald"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.consentAgreed}
                  onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
                  className="rounded border-gray-300 text-brand-emerald focus:ring-brand-emerald mt-0.5"
                />
                <span>
                  {t(
                    "I consent to Humna Academy contacting me on WhatsApp regarding my free trial class. No credit card required.",
                    "میں مفت ٹرائل کلاس کے لیے واٹس ایپ پر رابطہ کرنے کی اجازت دیتا/دیتی ہوں۔ کوئی پیشگی فیس درکار نہیں۔"
                  )}
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t("Back", "پیچھے")}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-deep to-brand-emerald hover:from-brand-emerald hover:to-brand-deep text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>{t("Scheduling Your Class...", "کلاس بک کی جا رہی ہے...")}</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-brand-gold animate-pulse" />
                    <span>{t("Book Free Trial Now", "مفت ٹرائل کلاس کنفرم کریں")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
