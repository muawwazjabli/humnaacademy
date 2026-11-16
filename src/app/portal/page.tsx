"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, BookOpen, Shield, ArrowRight, Sparkles } from "lucide-react";

export default function UnifiedPortalHubPage() {
  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fadeIn">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-deep/5 dark:bg-emerald-950/60 text-brand-emerald dark:text-brand-gold text-xs font-bold border border-brand-emerald/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Humna Academy Portals</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          Academy Learning & Management Portals
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          لاگ اِن کر کے اپنی کلاس کی ٹائمنگ، شیڈول، تفویض کردہ اساتذہ یا طلباء کی پروفائل دیکھیں۔
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Portal Card */}
        <Link
          href="/portal/student"
          className="group p-8 rounded-3xl bg-white dark:bg-[#0b231b] border-2 border-gray-200 dark:border-emerald-800/60 hover:border-brand-emerald dark:hover:border-brand-gold transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-brand-emerald dark:text-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-emerald dark:text-brand-gold block">
                Learner & Parent
              </span>
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                Student Portal
              </h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              طالب علم اپنی کلاس کا وقت، دن، لائیو کلاس کا لنک اور استاد کی تفصیلات دیکھنے کے لیے یہاں سے لاگ اِن کریں۔
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-deep dark:text-brand-gold group-hover:gap-3 transition-all">
            <span>Student Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Teacher Portal Card */}
        <Link
          href="/portal/teacher"
          className="group p-8 rounded-3xl bg-white dark:bg-[#0b231b] border-2 border-gray-200 dark:border-emerald-800/60 hover:border-brand-emerald dark:hover:border-brand-gold transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-brand-gold block">
                Instructors & Qaris
              </span>
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white group-hover:text-amber-700 transition-colors">
                Teacher Portal
              </h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              اساتذہ اپنے تفویض کردہ تمام طلباء، ان کی کلاس کی ٹائمنگ، رابطہ نمبر اور شیڈول دیکھنے کے لیے لاگ اِن کریں۔
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-brand-gold group-hover:gap-3 transition-all">
            <span>Teacher Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Admin Portal Card */}
        <Link
          href="/admin/login"
          className="group p-8 rounded-3xl bg-white dark:bg-[#0b231b] border-2 border-gray-200 dark:border-emerald-800/60 hover:border-brand-deep dark:hover:border-brand-gold transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Administration
              </span>
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white group-hover:text-brand-deep transition-colors">
                Admin Panel
              </h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              سپر ایڈمن اور عملہ ویب سائٹ کا مکمل ڈیٹا، ٹرائلز، کورسز، فیس اور تمام اکاؤنٹس سنبھالنے کے لیے لاگ اِن کریں۔
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-deep dark:text-brand-gold group-hover:gap-3 transition-all">
            <span>Admin Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
