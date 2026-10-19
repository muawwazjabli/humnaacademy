"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  MessageCircle,
  FileText,
  Search,
  Filter,
  Eye,
  Settings,
  Database
} from "lucide-react";
import { COURSES } from "@/data/courses";
import { TEACHER_PROFILES } from "@/data/teachers";
import { ACADEMY_CONFIG } from "@/lib/constants";

interface SampleTrialRequest {
  id: string;
  name: string;
  ageGroup: string;
  course: string;
  whatsapp: string;
  country: string;
  timeZone: string;
  status: "Pending" | "Matched" | "Completed";
  date: string;
}

export default function AdminPortalFoundationPage() {
  const [activeSection, setActiveSection] = useState<"trials" | "courses" | "teachers" | "settings">("trials");

  // Sample managed trial requests for previewing admin capabilities
  const [trialRequests, setTrialRequests] = useState<SampleTrialRequest[]>([
    {
      id: "HA-104921",
      name: "Fatima & Hamza (Siblings)",
      ageGroup: "Child",
      course: "Noorani Qaida Course",
      whatsapp: "+44 7911 123456",
      country: "United Kingdom",
      timeZone: "Europe/London",
      status: "Pending",
      date: "Today, 14:20",
    },
    {
      id: "HA-104880",
      name: "Brother Imran",
      ageGroup: "Adult",
      course: "Tajweed-ul-Quran Course",
      whatsapp: "+1 416 555 0192",
      country: "Canada",
      timeZone: "America/New_York",
      status: "Matched",
      date: "Yesterday",
    },
    {
      id: "HA-104812",
      name: "Maryam Bibi",
      ageGroup: "Adult",
      course: "Tafseer-ul-Quran Course",
      whatsapp: "+92 321 9876543",
      country: "Pakistan",
      timeZone: "Asia/Karachi",
      status: "Completed",
      date: "18 Oct 2026",
    },
  ]);

  const updateStatus = (id: string, newStatus: "Pending" | "Matched" | "Completed") => {
    setTrialRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-brand-deep to-gray-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-semibold border border-brand-gold/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Academy Administration & Operations</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold">
            Humna Academy Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Manage incoming trial bookings, assign qualified teachers, track student schedules, and update academy syllabus and prices.
          </p>
        </div>

        <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-xs text-right">
          <span className="text-brand-gold font-bold block">Role: Academy Administrator</span>
          <span className="text-gray-300 block">Status: Master Control Mode</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { key: "trials", label: `Trial Requests (${trialRequests.length})`, icon: Calendar },
          { key: "courses", label: `Courses (${COURSES.length})`, icon: BookOpen },
          { key: "teachers", label: `Teacher Roster (${TEACHER_PROFILES.length})`, icon: Users },
          { key: "settings", label: "Backend & Supabase Setup", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeSection === tab.key
                  ? "bg-brand-deep text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Trial Requests Management */}
      {activeSection === "trials" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-gray-900">
                Incoming Trial Bookings
              </h2>
              <p className="text-xs text-gray-500">
                Verify student contact details, check time zone compatibility, and assign a teacher.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Reference / Student</th>
                    <th className="px-6 py-3.5 font-bold">Course</th>
                    <th className="px-6 py-3.5 font-bold">WhatsApp / Region</th>
                    <th className="px-6 py-3.5 font-bold">Status</th>
                    <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {trialRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-brand-emerald block">
                          {req.id}
                        </span>
                        <span className="font-bold text-gray-900 block">{req.name}</span>
                        <span className="text-[11px] text-gray-400">
                          {req.ageGroup} • {req.date}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900">
                        {req.course}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-800 block">
                          {req.whatsapp}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {req.country} ({req.timeZone})
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : req.status === "Matched"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <a
                          href={`https://wa.me/${req.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Assalamu Alaikum ${req.name}, this is Humna Academy coordinating your free trial class for ${req.course}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() =>
                            updateStatus(
                              req.id,
                              req.status === "Pending"
                                ? "Matched"
                                : req.status === "Matched"
                                ? "Completed"
                                : "Pending"
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Courses Management */}
      {activeSection === "courses" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-gray-900">
              Curriculum & Course Catalog
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COURSES.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-emerald">{c.category}</span>
                  <span className="text-xs text-gray-400">{c.level}</span>
                </div>
                <h3 className="font-serif font-bold text-base text-gray-900">{c.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{c.shortDescription}</p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-brand-emerald font-semibold">
                  <Link href={`/courses/${c.slug}`}>View Public Page →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Teachers Management */}
      {activeSection === "teachers" && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="font-serif font-bold text-xl text-gray-900">Teacher Roster</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEACHER_PROFILES.map((tProfile) => (
              <div key={tProfile.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                <span className="text-xs font-bold text-brand-emerald">{tProfile.gender} Instructor</span>
                <h3 className="font-serif font-bold text-base text-gray-900">{tProfile.name}</h3>
                <p className="text-xs text-brand-goldDark font-medium">{tProfile.title}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Experience: {tProfile.experienceYears}</div>
                  <div>Languages: {tProfile.languages.join(", ")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Backend & Supabase Configuration Guide */}
      {activeSection === "settings" && (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-2xl text-gray-900 flex items-center gap-2">
              <Database className="w-6 h-6 text-brand-emerald" />
              <span>Production Database Connection (Supabase)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Follow these instructions to connect your live Supabase database for persistent bookings and authentication.
            </p>
          </div>

          <div className="bg-gray-900 text-gray-100 p-5 rounded-2xl font-mono text-xs space-y-2 overflow-x-auto">
            <p className="text-gray-400">// 1. Add your credentials to .env.local</p>
            <p className="text-emerald-400">NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
            <p className="text-emerald-400">NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...</p>
            <p className="text-emerald-400">SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsIn...</p>
          </div>

          <div className="space-y-2 text-xs text-gray-700">
            <h4 className="font-bold text-gray-900 text-sm">Required SQL Table Schema:</h4>
            <pre className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-mono text-xs overflow-x-auto">
{`create table trial_requests (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null,
  full_name text not null,
  age_group text not null,
  parent_name text,
  email text,
  whatsapp_number text not null,
  country text,
  preferred_course text not null,
  reading_level text,
  preferred_teacher text,
  preferred_language text,
  preferred_days text[],
  preferred_time text,
  time_zone text not null,
  additional_message text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
