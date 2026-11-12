"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarClock,
  Clock,
  FileText,
  MessageSquareQuote,
  Mail,
  RefreshCw,
  Database,
  ArrowRight,
  MessageCircle,
  Eye,
  Activity,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { BarChartCard, HorizontalBreakdownCard, ChartPoint } from "@/components/admin/AdminCharts";

interface StatsResponse {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalTrialRequests: number;
    pendingTrialRequests: number;
    totalBlogPosts: number;
    publishedTestimonials: number;
    totalContactMessages: number;
    unreadMessages: number;
  };
  charts: {
    monthlyTrials: ChartPoint[];
    studentTrends: ChartPoint[];
    monthlyEnrollments: ChartPoint[];
    coursePopularity: ChartPoint[];
    trialStatuses: ChartPoint[];
  };
  recentTrials: any[];
  recentActivities: any[];
}

export default function AdminDashboardPage() {
  const { admin, showToast, can } = useAdmin();
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      showToast("error", "Could not load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (admin) fetchStats();
  }, [admin, fetchStats]);

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sync failed");
      showToast(
        "success",
        `Synced default records to Firebase (Courses: ${json.seeded.courses}, Plans: ${json.seeded.pricingPlans}, FAQs: ${json.seeded.faqs}, Blogs: ${json.seeded.blogs}).`
      );
      await fetchStats();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to initialize defaults.");
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      label: "Total Students",
      value: data?.stats.totalStudents ?? 0,
      icon: GraduationCap,
      href: "/admin/students",
      color: "bg-emerald-50 text-brand-emerald dark:bg-emerald-950/60 dark:text-emerald-400",
    },
    {
      label: "Total Teachers",
      value: data?.stats.totalTeachers ?? 0,
      icon: Users,
      href: "/admin/teachers",
      color: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    },
    {
      label: "Total Courses",
      value: data?.stats.totalCourses ?? 0,
      icon: BookOpen,
      href: "/admin/courses",
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-brand-gold",
    },
    {
      label: "Total Trial Requests",
      value: data?.stats.totalTrialRequests ?? 0,
      icon: CalendarClock,
      href: "/admin/trial-requests",
      color: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    },
    {
      label: "Pending Trial Requests",
      value: data?.stats.pendingTrialRequests ?? 0,
      icon: Clock,
      href: "/admin/trial-requests",
      color: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    },
    {
      label: "Total Blog Posts",
      value: data?.stats.totalBlogPosts ?? 0,
      icon: FileText,
      href: "/admin/blogs",
      color: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
    },
    {
      label: "Published Testimonials",
      value: data?.stats.publishedTestimonials ?? 0,
      icon: MessageSquareQuote,
      href: "/admin/testimonials",
      color: "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
    },
    {
      label: "Website Contact Messages",
      value: data?.stats.totalContactMessages ?? 0,
      icon: Mail,
      href: "/admin/messages",
      color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
    },
  ];

  const getStatusBadge = (status?: string) => {
    const s = (status || "New").toLowerCase();
    if (s === "enrolled" || s === "trial completed") {
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    }
    if (s === "scheduled" || s === "contacted") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    }
    if (s === "cancelled" || s === "not interested") {
      return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
    }
    return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300";
  };

  return (
    <AdminShell
      title="Academy Overview"
      subtitle="Live Firebase statistics, enrollment trends, and incoming trial inquiries."
      actions={
        <>
          {(admin?.role === "super_admin" || admin?.role === "admin") && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-gold/50 bg-brand-cream/60 dark:bg-emerald-950/60 text-brand-deep dark:text-brand-gold text-xs font-bold hover:bg-brand-cream transition-colors disabled:opacity-60"
            >
              <Database className="w-4 h-4" />
              <span>{seeding ? "Syncing..." : "Sync Default Content to Firebase"}</span>
            </button>
          )}
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </>
      }
    >
      {/* Seed Alert Banner when courses aren't yet in Firestore */}
      {!loading && data && data.stats.totalCourses === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
              Initialize Academy Catalog in Firebase
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300/90">
              Your existing 13 courses, 3 pricing plans, blogs, and FAQs can be synced into Cloud Firestore with one click so you can edit or publish them directly from this dashboard.
            </p>
          </div>
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="px-4 py-2 rounded-xl bg-brand-deep text-white text-xs font-bold shrink-0 hover:bg-brand-emerald transition-colors"
          >
            {seeding ? "Initializing..." : "Preload Existing Courses & Data"}
          </button>
        </div>
      )}

      {/* 8 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 p-5 shadow-sm hover:shadow-md hover:border-brand-emerald/50 transition-all flex items-center justify-between gap-4 group"
            >
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">
                  {loading ? "—" : card.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${card.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <BarChartCard
          title="Monthly Trial Requests"
          subtitle="Incoming free trial inquiries by month"
          data={data?.charts.monthlyTrials || []}
        />
        <BarChartCard
          title="Student Registration Trends"
          subtitle="New student profiles recorded per month"
          data={data?.charts.studentTrends || []}
          accentColor="from-brand-goldDark to-brand-gold"
        />
        <BarChartCard
          title="Monthly Enrollment Trends"
          subtitle="Active & completed student enrollments"
          data={data?.charts.monthlyEnrollments || []}
          accentColor="from-emerald-700 to-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <HorizontalBreakdownCard
          title="Course Popularity"
          subtitle="Most requested courses across trials & enrollments"
          data={data?.charts.coursePopularity || []}
        />
        <HorizontalBreakdownCard
          title="Trial Request Status"
          subtitle="Live pipeline breakdown of all trial inquiries"
          data={data?.charts.trialStatuses || []}
        />
      </div>

      {/* Recent Trial Requests & Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Trial Requests Table */}
        {can("trialRequests") && (
          <div className="xl:col-span-2 bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-emerald-900/60 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                  Recent Trial Requests
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Latest submissions from the website trial form
                </p>
              </div>
              <Link
                href="/admin/trial-requests"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-emerald dark:text-brand-gold hover:underline"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-[#081d16] text-gray-600 dark:text-gray-300 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-emerald-900/60">
                  <tr>
                    <th className="px-4 py-3 font-bold">Student / Parent</th>
                    <th className="px-4 py-3 font-bold">Contact</th>
                    <th className="px-4 py-3 font-bold">Selected Course</th>
                    <th className="px-4 py-3 font-bold">Country</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/40">
                  {!data?.recentTrials?.length ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No trial requests found in Firestore yet.
                      </td>
                    </tr>
                  ) : (
                    data.recentTrials.map((req: any) => (
                      <tr
                        key={req.id}
                        className="hover:bg-gray-50/70 dark:hover:bg-emerald-950/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-bold text-gray-900 dark:text-white block">
                            {req.fullName || "Unnamed"}
                          </span>
                          {req.parentName && (
                            <span className="text-[11px] text-gray-500 block">
                              Parent: {req.parentName}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={`https://wa.me/${String(req.whatsappNumber || "").replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>{req.whatsappNumber}</span>
                          </a>
                          {req.email && (
                            <span className="block text-[10px] text-gray-500 truncate max-w-[140px]">
                              {req.email}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                          {req.preferredCourse}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                          {req.country || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {req.createdAt
                            ? new Date(req.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(
                              req.status
                            )}`}
                          >
                            {req.status || "New"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/trial-requests?view=${req.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-emerald-950/80 hover:bg-brand-deep hover:text-white text-gray-700 dark:text-gray-200 font-semibold transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-emerald-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-emerald dark:text-brand-gold" />
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            <Link
              href="/admin/activity-logs"
              className="text-xs font-bold text-brand-emerald dark:text-brand-gold hover:underline"
            >
              Full Log
            </Link>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[420px]">
            {!data?.recentActivities?.length ? (
              <p className="text-xs text-gray-500 text-center py-8">
                No administrative activity recorded yet.
              </p>
            ) : (
              data.recentActivities.map((act: any) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-[#081d16] border border-gray-100 dark:border-emerald-900/40 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-brand-emerald dark:text-brand-gold">
                      {act.action}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                    {act.summary}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
