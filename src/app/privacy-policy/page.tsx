import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Eye, Database } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Humna Academy",
  description:
    "How Humna Academy protects student and children's personal information, class data, and communications.",
};

export default function PrivacyPolicyPage() {
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
          Student Data Protection
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500">
          Last Updated: October 2026 • Humna Academy Online Quran Academy
        </p>
      </div>

      <div className="prose prose-emerald max-w-none text-gray-700 text-sm sm:text-base space-y-6">
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-serif font-bold text-xl text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-emerald" />
            <span>1. Commitment to Student & Child Privacy</span>
          </h2>
          <p className="leading-relaxed">
            Humna Academy (&quot;we,&quot; &quot;our,&quot; or &quot;the Academy&quot;) takes the privacy of our students, children, and families with utmost seriousness. We collect only the information necessary to schedule classes, match qualified teachers, evaluate Quranic reading levels, and communicate with parents regarding student progress.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-serif font-bold text-xl text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-emerald" />
            <span>2. Information We Collect</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Contact Information:</strong> Full name, parent/guardian name, phone number, WhatsApp number, and email address.</li>
            <li><strong>Learning Information:</strong> Student age group (child/adult), current Quran reading level, preferred course, time zone, and language preferences.</li>
            <li><strong>Communication Records:</strong> Feedback messages and schedule coordination messages between parents, students, and our academic administration.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-serif font-bold text-xl text-gray-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-emerald" />
            <span>3. How We Use & Protect Data</span>
          </h2>
          <p className="leading-relaxed text-xs sm:text-sm">
            Information gathered through our trial booking form or direct contact channels is used exclusively for educational management and class scheduling.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>We <strong>never sell, lease, or monetize</strong> student or parent contact details to any third-party advertisers.</li>
            <li>Children&apos;s information is handled strictly under parental supervision and consent.</li>
            <li>All online lesson links (e.g. Zoom or Google Meet) are private and encrypted.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-serif font-bold text-xl text-gray-900">
            4. Contact Regarding Privacy
          </h2>
          <p className="leading-relaxed text-xs sm:text-sm">
            For any questions, data access requests, or deletion of your student records, please contact Humna Academy directly via official WhatsApp at <strong>+92 301 7291844</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
