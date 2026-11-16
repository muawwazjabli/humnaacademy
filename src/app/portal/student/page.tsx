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
} from "lucide-react";
import { StudentRecord, TeacherProfile } from "@/types";

export default function StudentPortalPage() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);

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

  // Logged in: Display Student Profile & Schedule
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

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {student.status}
              </span>
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

          {/* Enrolled Course Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-emerald-900 pb-3">
              <BookOpen className="w-5 h-5 text-brand-emerald dark:text-brand-gold" />
              <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                Course Curriculum & Details (منتخب کردہ کورس)
              </h2>
            </div>
            <p className="text-sm font-bold text-brand-emerald dark:text-brand-gold">
              {student.selectedCourse}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              ہمنا اکیڈمی کے اس کورس میں آپ کو مستند اساتذہ کے ساتھ مکمل تجوید و مخارج، ناظرہ، اور اسلامی اسباق انفرادی (One-to-One) توجہ کے ساتھ پڑھائے جا رہے ہیں۔
            </p>
          </div>
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
    </div>
  );
}
