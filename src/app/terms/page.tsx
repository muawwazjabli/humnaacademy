import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Humna Academy",
  description:
    "Terms and conditions, attendance policies, and code of conduct for online classes at Humna Academy.",
};

export default function TermsPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-emerald hover:text-brand-deep transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
          Academic Guidelines
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-gray-500">
          Last Updated: October 2026 • Humna Academy Online Quran Academy
        </p>
      </div>

      <div className="prose prose-emerald max-w-none text-gray-700 text-sm sm:text-base space-y-6">
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-serif font-bold text-xl text-gray-900">
            1. Free Trial Class Conditions
          </h2>
          <p className="leading-relaxed text-xs sm:text-sm">
            Humna Academy offers one free 30-minute evaluation trial class per student. The trial incurs no financial fee and carries no obligation to enroll. Following the trial, parents and students decide whether to confirm ongoing monthly enrollment.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-serif font-bold text-xl text-gray-900">
            2. Class Attendance & Rescheduling
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Punctuality:</strong> Students are requested to join the online lesson at least 2 minutes prior to scheduled start time.</li>
            <li><strong>Advance Notice for Rescheduling:</strong> If a student cannot attend a scheduled class, notification must be sent to the academy coordinator or teacher at least 6 hours in advance.</li>
            <li><strong>Makeup Classes:</strong> Rescheduled classes are arranged based on instructor availability within the same billing month.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-serif font-bold text-xl text-gray-900">
            3. Tuition & Billing
          </h2>
          <p className="leading-relaxed text-xs sm:text-sm">
            Tuition is payable on a monthly advance basis upon schedule confirmation. If a student discontinues with advance notice within their first enrolled week, unconsumed lesson hours can be reviewed for credit or refund.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-serif font-bold text-xl text-gray-900">
            4. Code of Conduct & Respect
          </h2>
          <p className="leading-relaxed text-xs sm:text-sm">
            Quranic learning is a sacred endeavor. All interactions between students, parents, and instructors must adhere to Islamic manners (Adab), dignity, and mutual respect. The academy reserves the right to terminate lessons in the event of persistent inappropriate conduct.
          </p>
        </section>
      </div>
    </div>
  );
}
