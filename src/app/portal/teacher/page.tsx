"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  Video,
  MessageCircle,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Phone,
  Globe,
  Sparkles,
} from "lucide-react";
import { StudentRecord, TeacherProfile } from "@/types";

export default function TeacherPortalPage() {
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<StudentRecord[]>([]);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/portal/teacher/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTeacher(data.teacher);
        setStudents(data.students || []);
      } else {
        setTeacher(null);
        setStudents([]);
      }
    } catch {
      setTeacher(null);
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
      const res = await fetch("/api/portal/teacher/login", {
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
      setLoginError(err.message || "Invalid teacher credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/portal/teacher/logout", { method: "POST" });
      setTeacher(null);
      setStudents([]);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
        <p className="text-xs text-gray-500">Loading teacher instructional portal...</p>
      </div>
    );
  }

  // Not logged in: Show Login Screen
  if (!teacher) {
    return (
      <div className="py-16 max-w-md mx-auto px-4 sm:px-6 animate-fadeIn">
        <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800/80 shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-brand-gold flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
              Teacher Portal Login
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              اساتذہ اپنے تفویض کردہ طلباء اور کلاس شیڈول دیکھنے کے لیے لاگ اِن کریں۔
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
                Teacher Username / Email / Name
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                  placeholder="Enter teacher password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
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
              className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Sign In to Teacher Portal</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 dark:border-emerald-900/60 text-center space-y-2">
            <p className="text-[11px] text-gray-500">
              اگر پاسورڈ یاد نہیں یا نیا استاد رجسٹر کروانا ہو تو ایڈمن سے رابطہ کریں:
            </p>
            <a
              href="https://wa.me/923017291844?text=Assalam-o-Alaikum%2C%20I%20am%20a%20Humna%20Academy%20teacher%20requesting%20my%20Portal%20credentials."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-brand-gold font-bold text-[11px] hover:bg-amber-100"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Academy Admin on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Logged in: Display Teacher Profile & Assigned Students
  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-brand-deep rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {teacher.photoUrl ? (
            <img
              src={teacher.photoUrl}
              alt={teacher.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-gold/60 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 text-brand-gold font-bold flex items-center justify-center text-2xl border border-white/20">
              {teacher.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-brand-gold text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Certified Faculty Member</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">{teacher.name}</h1>
            <p className="text-xs sm:text-sm text-brand-cream/80">
              {teacher.title} • {students.length} Active Students Assigned
            </p>
          </div>
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
        {/* Left Column (2 Cols): Assigned Students List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700 dark:text-brand-gold" />
                <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                  My Assigned Students (میرے زیرِ تعلیم طلباء)
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-brand-gold">
                {students.length} Total Students
              </span>
            </div>

            {students.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#081d16] flex items-center justify-center mx-auto text-gray-400">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  No students assigned to your schedule yet.
                </p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  جیسے ہی ایڈمن پینل سے آپ کو طلباء تفویض کیے جائیں گے، ان کی تفصیلات اور کلاس ٹائمنگ یہاں ظاہر ہو جائے گی۔
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-200/80 dark:border-emerald-900/60 hover:border-amber-500/50 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/50 dark:border-emerald-900/40 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-gray-900 dark:text-white">
                            {student.fullName}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {student.status}
                          </span>
                        </div>
                        <p className="text-xs text-brand-emerald dark:text-brand-gold font-medium">
                          Course: {student.selectedCourse}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${String(student.whatsappNumber || "").replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {student.meetingLink && (
                          <a
                            href={student.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Class</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#0b231b] border border-gray-100 dark:border-emerald-900/40">
                        <span className="text-[10px] text-gray-400 block font-medium">
                          کلاس کا وقت (Time)
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{student.classTime || "Not specified"}</span>
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#0b231b] border border-gray-100 dark:border-emerald-900/40">
                        <span className="text-[10px] text-gray-400 block font-medium">
                          کلاس کے دن (Days)
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-brand-emerald" />
                          <span>{student.classDays || "Mon, Wed, Fri"}</span>
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#0b231b] border border-gray-100 dark:border-emerald-900/40">
                        <span className="text-[10px] text-gray-400 block font-medium">
                          دورانیہ (Duration)
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white mt-0.5 block">
                          {student.classDuration || "30 mins"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#0b231b] border border-gray-100 dark:border-emerald-900/40">
                        <span className="text-[10px] text-gray-400 block font-medium">
                          Country & TimeZone
                        </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate block mt-0.5">
                          {student.country || "—"} ({student.timeZone})
                        </span>
                      </div>
                    </div>

                    {student.adminNotes && (
                      <p className="text-[11px] text-gray-500 italic bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg">
                        <strong>Coordinator Note:</strong> {student.adminNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Teacher Bio & Availability */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 shadow-sm space-y-4">
            <h2 className="font-serif text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-emerald-900 pb-2">
              Faculty Profile Details
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block">Experience</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {teacher.experienceYears || "Certified Qari"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block">Languages</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {(teacher.languages || ["English", "Urdu"]).join(", ")}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block">Availability Slots</span>
                <span className="font-semibold text-amber-700 dark:text-brand-gold">
                  {teacher.availability || "Flexible international slots"}
                </span>
              </div>

              {teacher.qualifications && teacher.qualifications.length > 0 && (
                <div>
                  <span className="text-gray-400 block mb-1">Qualifications</span>
                  <ul className="space-y-1">
                    {teacher.qualifications.map((q, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Academy Contact */}
          <div className="p-5 rounded-3xl bg-amber-950 text-white space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-gold">
              Academy Faculty Support
            </h3>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              اگر طلباء کے ٹائم ٹیبل میں تبدیلی یا کسی قسم کی رہنمائی درکار ہو تو فوری رابطہ کریں:
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
