"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Clock,
  Globe2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { ACADEMY_CONFIG, buildWhatsAppLink } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    course: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getWhatsAppFromContactForm = () => {
    const text = `Assalamu Alaikum Humna Academy,\n\nName: ${formState.name}\nContact: ${formState.phone}\nInquiry regarding: ${formState.course}\nMessage: ${formState.message}`;
    return `https://wa.me/${ACADEMY_CONFIG.whatsappRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {t("Get in Touch", "رابطہ کریں")}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          {t("Contact Humna Academy", "حُمنہ اکیڈمی سے رابطہ")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {t(
            "We are available to answer your questions regarding class timings, teacher matching, curriculum details, and trial scheduling.",
            "کلاسز کے اوقات، اساتذہ کے انتخاب، نصاب اور ٹرائل شیڈول کے بارے میں معلومات کے لیے ہم سے رابطہ کریں۔"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Official Contact Channels */}
        <div className="lg:col-span-5 space-y-6">
          {/* WhatsApp Primary Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-deep to-brand-emerald text-white shadow-xl border border-brand-gold/30 space-y-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-brand-gold" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">
                Primary Contact Channel
              </span>
              <h3 className="font-serif text-2xl font-bold">
                Official WhatsApp & Phone
              </h3>
              <p className="text-2xl font-bold font-mono text-brand-cream">
                +92 301 7291844
              </p>
              <p className="text-xs text-brand-cream/80 leading-relaxed">
                Connect directly with our academic advisor for fast trial scheduling, fee questions, and student coordination.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={buildWhatsAppLink("general")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Direct WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Social Media Channels */}
          <div className="p-6 rounded-3xl bg-white border border-brand-border/80 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-base text-gray-900">
              {t("Official Social Media Channels", "سرکاری سوشل میڈیا اکاؤنٹس")}
            </h4>
            <p className="text-xs text-gray-500">
              Follow our official media profiles for daily Quran recitations, Dua lessons, and educational announcements:
            </p>

            <div className="space-y-2.5 pt-1">
              <a
                href={ACADEMY_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-brand-cream/60 transition-colors text-xs font-semibold text-gray-800"
              >
                <span>Facebook (@humnaacademy)</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>

              <a
                href={ACADEMY_CONFIG.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-brand-cream/60 transition-colors text-xs font-semibold text-gray-800"
              >
                <span>YouTube (@HAMNAACADEMY)</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>

              <a
                href={ACADEMY_CONFIG.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-brand-cream/60 transition-colors text-xs font-semibold text-gray-800"
              >
                <span>TikTok (@hamnaacademy)</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>

              <a
                href={ACADEMY_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-brand-cream/60 transition-colors text-xs font-semibold text-gray-800"
              >
                <span>Instagram (@acdemyhumna)</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-border/80 shadow-sm space-y-6">
            <div>
              <h2 className="font-serif font-bold text-2xl text-gray-900">
                {t("Send a Direct Inquiry", "آن لائن پیغام بھیجیں")}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  "Have a question about courses or timings? Leave a message below or forward directly to WhatsApp.",
                  "کورسز یا کلاسز کے بارے میں سوال ہو تو فارم پر کریں یا واٹس ایپ پر پیغام دیں۔"
                )}
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-brand-emerald mx-auto" />
                <h3 className="font-serif font-bold text-lg text-emerald-900">
                  {t("Message Prepared!", "آپ کا پیغام تیار ہے!")}
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  {t(
                    "You can forward this inquiry directly to our official WhatsApp (+92 301 7291844) for immediate assistance from our coordinator.",
                    "فوری جواب کے لیے آپ یہ پیغام براہ راست ہمارے واٹس ایپ پر بھیج سکتے ہیں۔"
                  )}
                </p>
                <div className="pt-2">
                  <a
                    href={getWhatsAppFromContactForm()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Message via WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Khan"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    WhatsApp or Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +92 300 1234567 or +44 7123 456789"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Topic / Course of Interest
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Noorani Qaida, Tajweed, or Fee details"
                    value={formState.course}
                    onChange={(e) => setFormState({ ...formState, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you with Quran learning?"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                >
                  Prepare Inquiry
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Ready for a class?</span>
              <Link href="/book-trial" className="text-brand-emerald font-semibold hover:underline">
                Book 30-min Free Trial →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
