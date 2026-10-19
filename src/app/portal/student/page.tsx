"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { ACADEMY_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageContext";

export default function StudentPortalFoundationPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "progress" | "fees">("overview");

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-brand-deep to-brand-emerald rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-gold text-xs font-semibold border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portal Architecture & Foundation</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold">
            Student & Parent Learning Portal
          </h1>
          <p className="text-xs sm:text-sm text-brand-cream/80 max-w-xl">
            Track live attendance, upcoming classes, daily Sabaq & Sabqi homework, and teacher evaluation notes.
          </p>
        </div>

        {/* Demo Account Indicator */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-1">
          <span className="text-brand-gold font-bold block">Preview Student: Abdullah (Grade 4)</span>
          <span className="text-brand-cream/80 block">Course: Noorani Qaida & Nazra</span>
          <span className="text-[11px] text-emerald-300 block">Status: Active Enrollment</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { key: "overview", label: "Dashboard Overview" },
          { key: "schedule", label: "Class Schedule & Attendance" },
          { key: "progress", label: "Hifz & Reading Progress" },
          { key: "fees", label: "Tuition & Invoicing" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-brand-deep text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-brand-border/80 shadow-sm space-y-1">
              <span className="text-xs text-gray-400 font-medium">Next Upcoming Class</span>
              <p className="text-base font-bold text-gray-900">Tomorrow at 5:30 PM</p>
              <span className="text-[11px] text-brand-emerald font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> 30-min One-to-One Session
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-border/80 shadow-sm space-y-1">
              <span className="text-xs text-gray-400 font-medium">Monthly Attendance</span>
              <p className="text-base font-bold text-gray-900">11 of 12 Classes</p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 92% Punctuality Rate
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-border/80 shadow-sm space-y-1">
              <span className="text-xs text-gray-400 font-medium">Current Milestone</span>
              <p className="text-base font-bold text-gray-900">Qaida Lesson 14</p>
              <span className="text-[11px] text-brand-goldDark font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Tashdeed & Meem Sakinah
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-brand-border/80 shadow-sm space-y-1">
              <span className="text-xs text-gray-400 font-medium">Tuition Status</span>
              <p className="text-base font-bold text-emerald-700">Paid (Current Month)</p>
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Next Due: 1st of next month
              </span>
            </div>
          </div>

          {/* Active Homework & Teacher Evaluation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-brand-border/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-emerald" />
                <span>Today&apos;s Homework & Revision Task</span>
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-brand-cream/40 border border-brand-border/60 space-y-1.5">
                  <span className="text-xs font-bold text-brand-deep uppercase tracking-wider">
                    Sabaq (New Lesson)
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    Noorani Qaida: Page 22, Lines 1 to 4 (Tashdeed Drills)
                  </p>
                  <p className="text-xs text-gray-600">
                    Practice applying extra pressure without breaking rhythm. Repeat 5 times out loud.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Sabqi (Previous Revision)
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    Page 20 & 21 (Sukoon and Jazm exercises)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Daily Dua Memorization
                  </span>
                  <p className="text-sm font-semibold text-gray-900">
                    Dua before eating & Dua upon completing meals (with Urdu/English meaning)
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-brand-border/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-gold" />
                <span>Teacher Evaluation & Remarks</span>
              </h3>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs text-emerald-950">
                <div className="flex items-center justify-between font-semibold">
                  <span>Instructor Feedback:</span>
                  <span className="text-[10px] text-emerald-700">Last Class (Yesterday)</span>
                </div>
                <p className="leading-relaxed italic">
                  &quot;Masha&apos;Allah, Abdullah demonstrated significant improvement in pronouncing throat letters (ح and ع) during today&apos;s drill. Keep reminding him to avoid rushing through the long vowels.&quot;
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${ACADEMY_CONFIG.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Message Teacher via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="bg-white p-6 rounded-2xl border border-brand-border/80 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-serif font-bold text-xl text-gray-900">Weekly Class Schedule</h3>
          <div className="divide-y divide-gray-100 text-xs sm:text-sm">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 block">Monday at 5:30 PM (UK Time)</span>
                <span className="text-gray-500">30 min • Noorani Qaida & Tajweed</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-brand-emerald text-xs font-semibold">Completed</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 block">Wednesday at 5:30 PM (UK Time)</span>
                <span className="text-gray-500">30 min • Noorani Qaida & Tajweed</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">Upcoming Next</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 block">Friday at 5:30 PM (UK Time)</span>
                <span className="text-gray-500">30 min • Weekly Revision & Duas</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">Scheduled</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === "progress" && (
        <div className="bg-white p-6 rounded-2xl border border-brand-border/80 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-serif font-bold text-xl text-gray-900">Curriculum Progress Track</h3>
          <p className="text-xs text-gray-500">Milestone progression recorded by instructor.</p>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Noorani Qaida Completion</span>
                <span>80%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-brand-emerald h-2.5 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Daily Duas Memorized (8 of 15)</span>
                <span>53%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-brand-gold h-2.5 rounded-full" style={{ width: "53%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fees Tab */}
      {activeTab === "fees" && (
        <div className="bg-white p-6 rounded-2xl border border-brand-border/80 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-serif font-bold text-xl text-gray-900">Tuition History & Invoicing</h3>
          <p className="text-xs text-gray-500">Official monthly receipts issued by Humna Academy.</p>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Invoice #HA-2026-10</span>
              <span>Paid (£40.00 / 3 classes weekly)</span>
            </div>
            <p className="text-gray-500">Method: Bank Transfer • Verified on 1st October 2026</p>
          </div>
        </div>
      )}

      {/* Architecture Documentation Box */}
      <div className="bg-brand-cream/60 rounded-3xl p-6 sm:p-8 border border-brand-border/80 text-xs text-gray-700 space-y-3">
        <h3 className="font-serif font-bold text-base text-brand-deep flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-gold" />
          <span>Production Integration Architecture (Supabase / NextAuth)</span>
        </h3>
        <p className="leading-relaxed">
          This portal foundation provides the data schema and visual UI required for authenticated student, parent, and teacher portals. To enable live login with passwordless magic links or passwords:
        </p>
        <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-gray-800">
          <li>1. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables.</li>
          <li>2. Apply the included SQL schema in README.md for tables: `students`, `schedules`, `attendance`, and `lesson_feedback`.</li>
          <li>3. Enable Row-Level Security (RLS) so students only view their personal records.</li>
        </ul>
      </div>
    </div>
  );
}
