import React, { Suspense } from "react";
import { Sparkles, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { TrialBookingForm } from "@/components/TrialBookingForm";
import { ACADEMY_CONFIG, buildWhatsAppLink } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Trial Class | Humna Academy",
  description:
    "Schedule your free 30-minute one-to-one online Quran trial class with certified male or female teachers. Flexible international time slots.",
};

export default function BookTrialPage() {
  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
          Zero Obligation • 100% Free
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          Book Your Free Trial Class
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Experience our one-to-one teaching methodology. Fill out the details below and our academic coordinator will match you with a certified tutor in your local time zone.
        </p>
      </div>

      {/* Trial Process Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-700">
        <div className="p-4 rounded-2xl bg-white border border-brand-border/80 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand-emerald flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block text-gray-900">30-Minute Session</span>
            <span className="text-gray-500">Live evaluation & reading drill</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-brand-border/80 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand-emerald flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block text-gray-900">No Credit Card Needed</span>
            <span className="text-gray-500">Free evaluation with no contract</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-brand-border/80 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand-emerald flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block text-gray-900">Teacher Preference</span>
            <span className="text-gray-500">Male or female instructor option</span>
          </div>
        </div>
      </div>

      {/* Booking Form wrapped in Suspense for search params */}
      <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading booking form...</div>}>
        <TrialBookingForm />
      </Suspense>

      {/* Alternative Direct WhatsApp Contact */}
      <div className="p-6 rounded-2xl bg-brand-cream/60 border border-brand-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-700">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold block text-gray-900">Prefer scheduling over WhatsApp chat?</span>
            <span className="text-gray-500">
              Message our academic team directly on +92 301 7291844
            </span>
          </div>
        </div>
        <a
          href={buildWhatsAppLink("trial")}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-semibold hover:bg-emerald-50 transition-colors shrink-0"
        >
          Open WhatsApp Chat
        </a>
      </div>
    </div>
  );
}
