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
  Globe2,
} from "lucide-react";
import { COURSES } from "@/data/courses";
import { COMMON_TIMEZONES, TEACHING_LANGUAGES, ACADEMY_CONFIG } from "@/lib/constants";
import { TrialBookingPayload } from "@/types";
import { useLanguage } from "./LanguageContext";

export const TrialBookingForm: React.FC = () => {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("course") || "";

  const [formData, setFormData] = useState<TrialBookingPayload>({
    fullName: "",
    ageGroup: "child",
    parentName: "",
    email: "",
    whatsappNumber: "",
    country: "",
    preferredCourse: initialCourse || COURSES[0].title,
    readingLevel: "Complete Beginner",
    preferredTeacher: "no_preference",
    preferredLanguage: "English",
    preferredDays: ["Monday", "Wednesday", "Friday"],
    preferredTime: "Evening (5:00 PM - 9:00 PM)",
    timeZone: "Europe/London",
    additionalMessage: "",
    consentAgreed: false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
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

  // Generate WhatsApp message when user clicks "Send to WhatsApp"
  const generateWhatsAppMessage = () => {
    const lines = [
      `*Humna Academy - Free Trial Request*`,
      `Reference: ${submissionResult?.referenceId || "Direct Form Inquiry"}`,
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
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border/80 shadow-xl max-w-2xl mx-auto space-y-6 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-emerald flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
            {submissionResult.isPersistedToDatabase
              ? "Saved to Academy Database"
              : "Demo Mode • Request Prepared"}
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            {t("Trial Request Prepared Successfully!", "ٹرائل کلاس کی درخواست تیار ہے!")}
          </h2>

          <p className="text-xs text-gray-500 font-mono">
            Booking Reference ID: <strong className="text-gray-900">{submissionResult.referenceId}</strong>
          </p>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
          {submissionResult.message}
        </p>

        {/* WhatsApp Forward Action */}
        <div className="p-5 bg-brand-cream/60 rounded-2xl border border-brand-border/70 space-y-3 text-left">
          <div className="flex items-center gap-2 text-brand-deep font-semibold text-xs sm:text-sm">
            <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t("Instant WhatsApp Notification Option", "واٹس ایپ پر فوری تصدیق")}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t(
              "You can forward your completed booking summary directly to our official WhatsApp (+92 301 7291844) to get assigned to a teacher immediately.",
              "آپ اپنی مکمل درخواست فوری تصدیق کے لیے ہمارے سرکاری واٹس ایپ پر ایک کلک میں بھیج سکتے ہیں۔"
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
            onClick={() => setSubmissionResult(null)}
            className="text-xs text-brand-emerald hover:underline font-semibold"
          >
            {t("Submit Another Trial Request", "ایک اور درخواست دیں")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border/80 shadow-xl space-y-8"
    >
      {/* Demo Notice */}
      <div className="p-4 rounded-2xl bg-brand-creamLight border border-brand-border/70 text-xs text-gray-600 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Free 30-Minute Trial:</strong> Submit your request below. Our coordinator will match your schedule and coordinate your class via WhatsApp or call.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section 1: Student Information */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-gray-900 border-b border-gray-100 pb-2">
          1. Student & Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Full Name (Student or Parent) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Abdullah Khan / Fatima Ahmed"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Student Age Group <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, ageGroup: "child" })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  formData.ageGroup === "child"
                    ? "bg-brand-deep text-white border-brand-deep"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                Child (Ages 4-16)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, ageGroup: "adult" })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  formData.ageGroup === "adult"
                    ? "bg-brand-deep text-white border-brand-deep"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                Adult (17+)
              </button>
            </div>
          </div>
        </div>

        {formData.ageGroup === "child" && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Parent / Guardian Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mr. Tariq Mahmood"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              WhatsApp / Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +44 7123 456789 or +92 300 1234567"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email Address <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              placeholder="parent@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Country of Residence
            </label>
            <input
              type="text"
              placeholder="e.g. United Kingdom, USA, Pakistan"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Course & Learning Level */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-gray-900 border-b border-gray-100 pb-2">
          2. Academic Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Preferred Course <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.preferredCourse}
              onChange={(e) => setFormData({ ...formData, preferredCourse: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Current Quran Reading Level
            </label>
            <select
              value={formData.readingLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  readingLevel: e.target.value as TrialBookingPayload["readingLevel"],
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            >
              <option value="Complete Beginner">Complete Beginner (Cannot recognize letters)</option>
              <option value="Can read letters">Can recognize individual Arabic letters</option>
              <option value="Slow reading">Can read slowly with hesitation</option>
              <option value="Fluent">Can read fluently, needs Tajweed correction</option>
              <option value="Advanced">Advanced / Memorization / Ijazah Candidate</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Teacher Preference
            </label>
            <select
              value={formData.preferredTeacher}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferredTeacher: e.target.value as TrialBookingPayload["preferredTeacher"],
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            >
              <option value="no_preference">No Preference (Best available tutor)</option>
              <option value="female">Female Teacher (For sisters / children)</option>
              <option value="male">Male Teacher</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Preferred Teaching Language
            </label>
            <select
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
            >
              {TEACHING_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Schedule & Time Zone */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-gray-900 border-b border-gray-100 pb-2">
          3. Scheduling & Time Zone
        </h3>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Your Local Time Zone <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.timeZone}
            onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Preferred Days of the Week
          </label>
          <div className="flex flex-wrap gap-2">
            {daysList.map((day) => {
              const selected = formData.preferredDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selected
                      ? "bg-brand-emerald text-white border-brand-emerald"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Preferred Time Window (in your local time)
          </label>
          <input
            type="text"
            placeholder="e.g. 6:00 PM - 8:00 PM or Weekend Mornings"
            value={formData.preferredTime}
            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Additional Notes or Learning Goals
          </label>
          <textarea
            rows={3}
            placeholder="Tell us about previous Quran reading experience, preferred pace, or special needs..."
            value={formData.additionalMessage}
            onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
          />
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className="pt-2 border-t border-gray-100">
        <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.consentAgreed}
            onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
            className="rounded border-gray-300 text-brand-emerald focus:ring-brand-emerald mt-0.5"
          />
          <span>
            I consent to Humna Academy contacting me regarding online Quran classes via WhatsApp or phone. We respect your privacy and never sell or share family information.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="space-y-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-brand-deep to-brand-emerald hover:from-brand-emerald hover:to-brand-deep text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span>Processing your trial request...</span>
          ) : (
            <>
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span>Submit Free Trial Request</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-500 text-center">
          No credit card required. Free 30-minute evaluation session with zero obligation.
        </p>
      </div>
    </form>
  );
};
