"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Clock,
  Calendar,
  Video,
  User,
  BookOpen,
  MessageCircle,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Globe,
  Award,
  CreditCard,
  FileText,
  Star,
  Send,
  Upload,
  Sparkles,
} from "lucide-react";
import { DailyClassReport, FeeRecord, LeaveRequestRecord, StudentRecord, TeacherProfile } from "@/types";
import { DigitalQuranReader } from "@/components/DigitalQuranReader";
import { CertificateModal } from "@/components/CertificateModal";

export default function StudentPortalPage() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "diary" | "fees" | "reader">("overview");

  // Daily Reports & Progress
  const [dailyReports, setDailyReports] = useState<DailyClassReport[]>([]);

  // Leave Requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRecord[]>([]);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: "leave" as "leave" | "reschedule",
    date: new Date().toISOString().slice(0, 10),
    preferredNewTime: "",
    reason: "",
  });
  const [submittingLeave, setSubmittingLeave] = useState(false);

  // Fees
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [feeForm, setFeeForm] = useState({
    month: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
    amount: "$40",
    receiptUrl: "",
    notes: "",
  });
  const [submittingFee, setSubmittingFee] = useState(false);

  // Certificate Modal
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/portal/student/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
        setTeacher(data.teacher);

        // Load daily reports, leaves, and fees in parallel
        const [rRes, lRes, fRes] = await Promise.all([
          fetch("/api/portal/daily-reports", { cache: "no-store" }),
          fetch("/api/portal/leave-requests", { cache: "no-store" }),
          fetch("/api/portal/fees", { cache: "no-store" }),
        ]);

        if (rRes.ok) {
          const rData = await rRes.json();
          setDailyReports(rData.reports || []);
        }
        if (lRes.ok) {
          const lData = await lRes.json();
          setLeaveRequests(lData.requests || []);
        }
        if (fRes.ok) {
          const fData = await fRes.json();
          setFeeRecords(fData.fees || []);
        }
      } else {
        setStudent(null);
        setTeacher(null);
      }
    } catch {
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/portal/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      await checkAuth();
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/portal/student/logout", { method: "POST" });
      setStudent(null);
      setTeacher(null);
    } catch {
      // ignore
    }
  };

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLeave(true);
    try {
      const res = await fetch("/api/portal/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setLeaveRequests((prev) => [data.request, ...prev]);
      setLeaveModalOpen(false);
      setLeaveForm({
        type: "leave",
        date: new Date().toISOString().slice(0, 10),
        preferredNewTime: "",
        reason: "",
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingLeave(false);
    }
  };

  const handleSubmitFeeProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFee(true);
    try {
      const res = await fetch("/api/portal/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feeForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setFeeRecords((prev) => [data.fee, ...prev]);
      setFeeModalOpen(false);
      alert("Payment proof submitted successfully! The administration will verify it.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingFee(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
        <p className="text-xs text-gray-500">Loading student learning portal...</p>
      </div>
    );
  }

  // Not logged in: Show Login Screen
  if (!student) {
    return (
      <div className="py-16 max-w-md mx-auto px-4 sm:px-6 animate-fadeIn">
        <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800/80 shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-brand-emerald dark:text-brand-gold flex items-center justify-center mx-auto">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
              Student Portal Login
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              طالب علم اپنی کلاس کی ٹائمنگ اور پروفائل دیکھنے کے لیے لاگ اِن کریں۔
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Student Username / WhatsApp
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or registered phone"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Portal Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password provided by academy"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Sign In to Student Portal</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 dark:border-emerald-900/60 text-center space-y-2">
            <p className="text-[11px] text-gray-500">
              اگر آپ کے پاس یوزر نیم یا پاسورڈ نہیں ہے تو اکیڈمی ایڈمن سے رابطہ کریں:
            </p>
            <a
              href="https://wa.me/923017291844?text=Assalam-o-Alaikum%2C%20I%20need%20my%20Student%20Portal%20credentials%20for%20Humna%20Academy."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Academy on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Logged in: Display Student Profile, Tabs & Features
  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-deep via-[#0e3b2e] to-brand-emerald rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-gold text-xs font-semibold border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Student Learning Profile</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold">{student.fullName}</h1>
          <p className="text-xs sm:text-sm text-brand-cream/80 max-w-xl">
            {student.selectedCourse} • Enrolled {student.enrollmentDate}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCertModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-gold hover:bg-brand-goldDark text-brand-deep text-xs font-bold transition-all shadow-md"
          >
            <Award className="w-4 h-4" />
            <span>Course Certificate</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-emerald-900 pb-2 overflow-x-auto text-xs">
        {[
          { key: "overview", label: "Overview & Schedule", icon: Clock },
          { key: "diary", label: `Daily Sabaq & Progress (${dailyReports.length})`, icon: FileText },
          { key: "fees", label: "Tuition & Fees", icon: CreditCard },
          { key: "reader", label: "Quran & Qaida Reader", icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-brand-deep text-white shadow-sm"
                  : "bg-gray-100 dark:bg-[#081d16] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Schedule */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Left Column (2 Cols): Class Schedule & Live Join */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Schedule Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-emerald dark:text-brand-gold" />
                  <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                    Class Schedule & Timing (کلاس کی ٹائمنگ اور شیڈول)
                  </h2>
                </div>
                <button
                  onClick={() => setLeaveModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-brand-emerald text-brand-emerald dark:text-brand-gold font-bold text-xs hover:bg-brand-cream/30"
                >
                  Request Leave / Reschedule
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-100 dark:border-emerald-900/60 space-y-1">
                  <span className="text-[11px] text-gray-400 font-medium block">کلاس کا وقت (Class Time)</span>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {student.classTime || "Timing to be announced"}
                  </p>
                  <span className="text-[10px] text-gray-500">
                    {student.timeZone || "Pakistan Time (PKT)"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-100 dark:border-emerald-900/60 space-y-1">
                  <span className="text-[11px] text-gray-400 font-medium block">کلاس کے دن (Class Days)</span>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {student.classDays || "Mon, Wed, Fri"}
                  </p>
                  <span className="text-[10px] text-gray-500">Weekly schedule</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-100 dark:border-emerald-900/60 space-y-1">
                  <span className="text-[11px] text-gray-400 font-medium block">دورانیہ (Duration)</span>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {student.classDuration || "30 mins"}
                  </p>
                  <span className="text-[10px] text-brand-emerald">1-on-1 Individual Class</span>
                </div>
              </div>

              {/* Live Class Join Section */}
              <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600 dark:text-brand-gold" />
                    <span>Online Live Classroom</span>
                  </h3>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                    {student.meetingLink
                      ? "اپنی کلاس شروع ہونے پر نیچے دیے گئے بٹن پر کلک کر کے شامل ہوں۔"
                      : "آپ کا استاد کلاس کے وقت واٹس ایپ پر لائیو کلاس کا لنک شیئر کرے گا۔"}
                  </p>
                </div>

                {student.meetingLink ? (
                  <a
                    href={student.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Live Class</span>
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/923017291844?text=Assalam-o-Alaikum%2C%20I%20am%20${encodeURIComponent(student.fullName)}.%20Please%20share%20my%20class%20link.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Ask for Link on WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Leave Requests Status */}
            {leaveRequests.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-emerald" />
                  <span>My Leave & Reschedule Requests (درخواستیں)</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {leaveRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-[#081d16] flex items-center justify-between border border-gray-100 dark:border-emerald-950"
                    >
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white capitalize">
                          {req.type}: {req.date}
                        </span>
                        <p className="text-gray-500">{req.reason}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          req.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : req.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (1 Col): Assigned Teacher & Profile Details */}
          <div className="space-y-6">
            {/* Assigned Teacher Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-emerald-900 pb-3">
                <User className="w-5 h-5 text-brand-emerald dark:text-brand-gold" />
                <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                  Assigned Teacher (آپ کے استاد)
                </h2>
              </div>

              {teacher ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {teacher.photoUrl ? (
                      <img
                        src={teacher.photoUrl}
                        alt={teacher.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-brand-gold/40"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-brand-deep text-brand-gold font-bold flex items-center justify-center text-lg">
                        {teacher.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {teacher.name}
                      </h3>
                      <p className="text-xs text-brand-emerald dark:text-brand-gold font-medium">
                        {teacher.title}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        Experience: {teacher.experienceYears || "Certified Qari"}
                      </span>
                    </div>
                  </div>

                  {teacher.bio && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
                      {teacher.bio}
                    </p>
                  )}

                  <div className="pt-2 border-t border-gray-100 dark:border-emerald-900/60 text-[11px] text-gray-500 space-y-1">
                    <p>
                      <strong>Languages:</strong> {(teacher.languages || ["English", "Urdu"]).join(", ")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081d16] text-center space-y-1">
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {student.assignedTeacherName || "Teacher Allocation in Progress"}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    اکیڈمی کوآرڈینیٹر آپ کے لیے موزوں استاد تفویض کر رہے ہیں۔
                  </p>
                </div>
              )}
            </div>

            {/* Student Profile Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 shadow-sm space-y-3">
              <h2 className="font-serif text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-emerald-900 pb-2">
                Student Information (پروفائل ریکارڈ)
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-emerald-950">
                  <span className="text-gray-400">Parent / Guardian:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {student.parentName || "—"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-emerald-950">
                  <span className="text-gray-400">WhatsApp:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {student.whatsappNumber}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-emerald-950">
                  <span className="text-gray-400">Country:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {student.country || "International"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Time Zone:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {student.timeZone}
                  </span>
                </div>
              </div>
            </div>

            {/* Academy Support Help */}
            <div className="p-5 rounded-3xl bg-emerald-950 text-white space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-brand-gold">
                Need Help or Schedule Change?
              </h3>
              <p className="text-xs text-brand-cream/80 leading-relaxed">
                اگر کلاس کی ٹائمنگ تبدیل کروانی ہو یا کوئی سوال ہو تو اکیڈمی سے رابطہ کریں:
              </p>
              <a
                href="https://wa.me/923017291844"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold w-full justify-center transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Coordinator</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Daily Sabaq & Progress Diary */}
      {activeTab === "diary" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-emerald-900 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-emerald" />
                  <span>Daily Learning Diary & Progress Reports (روزانہ سبق ڈائری)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  ہر کلاس کے بعد استاد کا دیا گیا سبق، دہرائی، تجوید کی غلطیاں اور فیڈ بیک۔
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {dailyReports.length} Classes Recorded
              </span>
            </div>

            {dailyReports.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  No class reports recorded yet.
                </p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  جیسے ہی آپ کا استاد کلاس مکمل کر کے رپورٹ درج کرے گا، آپ کا روزانہ کا سبق یہاں ظاہر ہو جائے گا۔
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dailyReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-200/80 dark:border-emerald-900/60 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 dark:border-emerald-900/40 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          Date: {report.date}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            report.attendance === "Present"
                              ? "bg-emerald-100 text-emerald-800"
                              : report.attendance === "Absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {report.attendance}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: report.rating || 5 }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#0b231b] border border-gray-100 dark:border-emerald-900/40 space-y-1">
                        <span className="text-[10px] text-brand-emerald font-bold uppercase block">
                          آج کا نیا سبق (Sabaq)
                        </span>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                          {report.sabaq || "—"}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#0b231b] border border-gray-100 dark:border-emerald-900/40 space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">
                          حالیہ دہرائی (Sabqi)
                        </span>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {report.sabqi || "—"}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#0b231b] border border-gray-100 dark:border-emerald-900/40 space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">
                          پرانی دہرائی (Manzil)
                        </span>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {report.manzil || "—"}
                        </p>
                      </div>
                    </div>

                    {report.teacherNotes && (
                      <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-xs">
                        <span className="text-[11px] font-bold text-brand-emerald block mb-0.5">
                          Teacher Feedback & Duas:
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          &quot;{report.teacherNotes}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Tuition & Fees */}
      {activeTab === "fees" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-emerald-900 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-emerald" />
                  <span>Tuition Fee Invoices & Payment (ماہانہ فیس ریکارڈ)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  ماہانہ فیس کی رسید اپلوڈ کریں اور ادائیگی کا سٹیٹس چیک کریں۔
                </p>
              </div>
              <button
                onClick={() => setFeeModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Payment Proof</span>
              </button>
            </div>

            {/* Payment Details Card */}
            <div className="p-5 rounded-2xl bg-brand-cream/60 dark:bg-emerald-950/40 border border-brand-border/60 text-xs space-y-3">
              <h3 className="font-bold text-sm text-brand-deep dark:text-brand-gold">
                Academy Payment Methods (ادائیگی کے طریقے)
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                برطانیہ، امریکہ، کینیڈا، پاکستان اور خلیجی ممالک سے فیس کی ادائیگی <strong>Wise, Bank Transfer, PayPal</strong> یا براہ راست اکاؤنٹ کے ذریعے کی جا سکتی ہے۔ فیس جمع کروانے کے بعد اس کی رسید یہاں اپلوڈ کر دیں۔
              </p>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-brand-emerald dark:text-brand-gold">
                <span>✓ Wise Transfer Accepted</span>
                <span>✓ International Bank IBAN</span>
                <span>✓ PayPal / Remittance</span>
              </div>
            </div>

            {/* Fee Invoices List */}
            {feeRecords.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                No fee invoices currently recorded. You can upload your payment receipt using the button above.
              </div>
            ) : (
              <div className="space-y-3">
                {feeRecords.map((fee) => (
                  <div
                    key={fee.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-100 dark:border-emerald-900 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-sm text-gray-900 dark:text-white block">
                        {fee.month}
                      </span>
                      <span className="text-gray-500">
                        Amount: {fee.amount} ({fee.currency})
                      </span>
                      {fee.notes && <p className="text-[11px] text-gray-400 mt-1">{fee.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          fee.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : fee.status === "verifying"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {fee.status === "paid" ? "Paid ✓" : fee.status === "verifying" ? "Under Verification" : "Due"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Quran & Qaida Reader */}
      {activeTab === "reader" && (
        <div className="space-y-4 animate-fadeIn">
          <DigitalQuranReader />
        </div>
      )}

      {/* Leave Request Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 dark:border-emerald-800 text-xs">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
              Request Leave / Reschedule (رخصت یا وقت تبدیلی)
            </h3>
            <form onSubmit={handleSubmitLeave} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">درخواست کی قسم (Request Type)</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                >
                  <option value="leave">چھٹی کی درخواست (Leave Request)</option>
                  <option value="reschedule">کلاس کے وقت میں تبدیلی (Reschedule)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">تاریخ (Date)</label>
                <input
                  type="date"
                  required
                  value={leaveForm.date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              {leaveForm.type === "reschedule" && (
                <div>
                  <label className="font-semibold block mb-1">مطلوبہ نیا وقت (Preferred New Time)</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 PM (Tomorrow)"
                    value={leaveForm.preferredNewTime}
                    onChange={(e) => setLeaveForm({ ...leaveForm, preferredNewTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">وجہ / تفصیل (Reason)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="سکول امتحان، بیماری یا سفر کی وجہ بیان کریں..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-emerald-900">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLeave}
                  className="px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold"
                >
                  {submittingLeave ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fee Proof Modal */}
      {feeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 dark:border-emerald-800 text-xs">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
              Upload Fee Receipt (فیس کی رسید جمع کروائیں)
            </h3>
            <form onSubmit={handleSubmitFeeProof} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">مہینہ (Month)</label>
                <input
                  type="text"
                  required
                  value={feeForm.month}
                  onChange={(e) => setFeeForm({ ...feeForm, month: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ادا شدہ رقم (Amount Paid)</label>
                <input
                  type="text"
                  required
                  value={feeForm.amount}
                  onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ٹرانزیکشن ریفرنس / رسید لنک (Transaction Ref / Receipt URL)</label>
                <input
                  type="text"
                  placeholder="e.g. Bank Ref #12345 or Image Link"
                  value={feeForm.receiptUrl}
                  onChange={(e) => setFeeForm({ ...feeForm, receiptUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">اضافی تفصیل (Notes)</label>
                <textarea
                  rows={2}
                  placeholder="بینک کا نام یا ٹرانسفر کا طریقہ..."
                  value={feeForm.notes}
                  onChange={(e) => setFeeForm({ ...feeForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-emerald-900">
                <button
                  type="button"
                  onClick={() => setFeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFee}
                  className="px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold"
                >
                  {submittingFee ? "Submitting..." : "Submit Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate Modal */}
      <CertificateModal
        open={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        studentName={student.fullName}
        courseName={student.selectedCourse}
      />
    </div>
  );
}
