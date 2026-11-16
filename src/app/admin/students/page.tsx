"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Download,
  Edit3,
  Trash2,
  Eye,
  MessageCircle,
  X,
  Loader2,
  UserCheck,
  Clock,
  Calendar,
  Key,
  Video,
  Copy,
  Check,
  EyeOff,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { exportRecordsToCSV } from "@/lib/csv-export";
import { Course, StudentRecord, StudentStatus, TeacherProfile } from "@/types";
import { COMMON_TIMEZONES } from "@/lib/constants";

const STUDENT_STATUSES: StudentStatus[] = ["Active", "Pending", "Completed", "Inactive"];

const EMPTY_STUDENT: Partial<StudentRecord> = {
  fullName: "",
  parentName: "",
  email: "",
  whatsappNumber: "",
  country: "",
  timeZone: "Asia/Karachi",
  age: "",
  gender: "Prefer not to say",
  selectedCourse: "Quran Reading Course (Nazra)",
  assignedTeacherId: "",
  assignedTeacherName: "",
  classTime: "",
  classDays: "Mon, Wed, Fri",
  classDuration: "30 mins",
  meetingLink: "",
  portalUsername: "",
  portalPassword: "",
  enrollmentDate: new Date().toISOString().slice(0, 10),
  status: "Active",
  adminNotes: "",
};

export default function AdminStudentsPage() {
  const { showToast, globalSearch } = useAdmin();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState<Partial<StudentRecord>>(EMPTY_STUDENT);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);

  const generateStudentPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let pass = "HA@";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({
      ...prev,
      portalPassword: pass,
      portalUsername: prev.portalUsername || (prev.fullName ? prev.fullName.toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(100 + Math.random() * 900) : "student" + Math.floor(1000 + Math.random() * 9000)),
    }));
  };

  const [profileView, setProfileView] = useState<StudentRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, tRes, cRes] = await Promise.all([
        fetch("/api/admin/resource/students", { cache: "no-store" }),
        fetch("/api/admin/resource/teachers", { cache: "no-store" }),
        fetch("/api/admin/resource/courses", { cache: "no-store" }),
      ]);
      if (sRes.ok) {
        const j = await sRes.json();
        setStudents(j.items || []);
      }
      if (tRes.ok) {
        const j = await tRes.json();
        setTeachers(j.items || []);
      }
      if (cRes.ok) {
        const j = await cRes.json();
        setCourses(j.items || []);
      }
    } catch {
      showToast("error", "Failed to load student records.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.whatsappNumber) {
      showToast("error", "Student name and WhatsApp number are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/resource/students", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast("success", `Student "${form.fullName}" saved.`);
      setModalOpen(false);
      await loadData();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to save student.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resource/students?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "Student record deleted.");
      setDeleteTarget(null);
      await loadData();
    } catch {
      showToast("error", "Could not delete student.");
    } finally {
      setDeleting(false);
    }
  };

  const q = (search || globalSearch).toLowerCase().trim();
  const filtered = students.filter((s) => {
    if (statusFilter !== "All" && s.status !== statusFilter) return false;
    if (courseFilter !== "All" && s.selectedCourse !== courseFilter) return false;
    if (q) {
      const hay = `${s.fullName} ${s.parentName || ""} ${s.email || ""} ${s.whatsappNumber} ${s.country} ${s.selectedCourse}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const handleExport = () => {
    exportRecordsToCSV(
      "humna-academy-students",
      [
        { key: "fullName", label: "Student Name" },
        { key: "parentName", label: "Parent/Guardian" },
        { key: "age", label: "Age" },
        { key: "gender", label: "Gender" },
        { key: "email", label: "Email" },
        { key: "whatsappNumber", label: "WhatsApp" },
        { key: "country", label: "Country" },
        { key: "timeZone", label: "Time Zone" },
        { key: "selectedCourse", label: "Course" },
        { key: "assignedTeacherName", label: "Teacher" },
        { key: "enrollmentDate", label: "Enrollment Date" },
        { key: "status", label: "Status" },
      ],
      filtered
    );
  };

  return (
    <AdminShell
      title="Student Management"
      subtitle="Manage enrolled students, teacher assignments, enrollment history, and notes."
      actions={
        <>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#0b231b] text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              setIsNew(true);
              setForm({ ...EMPTY_STUDENT, enrollmentDate: new Date().toISOString().slice(0, 10) });
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </>
      }
    >
      {/* Filters */}
      <div className="bg-white dark:bg-[#0b231b] p-4 rounded-2xl border border-gray-200 dark:border-emerald-900/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, parent, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
        >
          <option value="All">All Statuses</option>
          {STUDENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
        >
          <option value="All">All Courses</option>
          {Array.from(new Set(students.map((s) => s.selectedCourse).filter(Boolean))).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#081d16] border-b border-gray-200 dark:border-emerald-900/60 uppercase text-[10px] text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3.5 font-bold">Student</th>
                <th className="px-4 py-3.5 font-bold">Contact</th>
                <th className="px-4 py-3.5 font-bold">Course & Teacher</th>
                <th className="px-4 py-3.5 font-bold">Enrolled</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
                    Loading student records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No students recorded yet. Click &quot;Add Student&quot; or convert a Trial Request.
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/70 dark:hover:bg-emerald-950/30">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-gray-900 dark:text-white text-sm block">
                        {student.fullName}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        {student.parentName ? `Parent: ${student.parentName} • ` : ""}
                        {student.country}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <a
                        href={`https://wa.me/${String(student.whatsappNumber || "").replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{student.whatsappNumber}</span>
                      </a>
                      {student.email && (
                        <span className="block text-[11px] text-gray-500">{student.email}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-gray-900 dark:text-white block">
                        {student.selectedCourse}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        Teacher: {student.assignedTeacherName || "Unassigned"}
                      </span>
                      {student.classTime && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-brand-emerald dark:text-brand-gold font-medium mt-0.5">
                          <Clock className="w-3 h-3" /> {student.classTime} {student.classDays ? `(${student.classDays})` : ""}
                        </span>
                      )}
                      {student.portalUsername && (
                        <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                          ID: {student.portalUsername}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {student.enrollmentDate || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          student.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : student.status === "Completed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : student.status === "Pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setProfileView(student)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-emerald hover:text-white"
                          title="View Student Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setIsNew(false);
                            setForm(student);
                            setModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white"
                          title="Edit Student"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(student)}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-600 hover:text-white text-red-600"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <h3 className="font-serif text-xl font-bold">
                {isNew ? "Add New Student" : `Edit Student: ${form.fullName}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName || ""}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={form.parentName || ""}
                    onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={form.whatsappNumber || ""}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email || ""}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Country</label>
                  <input
                    type="text"
                    value={form.country || ""}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Time Zone</label>
                  <select
                    value={form.timeZone || "Asia/Karachi"}
                    onChange={(e) => setForm({ ...form, timeZone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {COMMON_TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Age (Optional)</label>
                  <input
                    type="text"
                    value={form.age || ""}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Gender (Voluntary)</label>
                  <select
                    value={form.gender || "Prefer not to say"}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value as StudentRecord["gender"] })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Selected Course</label>
                  <select
                    value={form.selectedCourse || ""}
                    onChange={(e) => setForm({ ...form, selectedCourse: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                    <option value="Quran Reading Course (Nazra)">Quran Reading Course (Nazra)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Assigned Teacher</label>
                  <select
                    value={form.assignedTeacherId || ""}
                    onChange={(e) => {
                      const t = teachers.find((x) => x.id === e.target.value);
                      setForm({
                        ...form,
                        assignedTeacherId: e.target.value,
                        assignedTeacherName: t ? t.name : "",
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="">-- Unassigned --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    value={form.enrollmentDate || ""}
                    onChange={(e) => setForm({ ...form, enrollmentDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Student Status</label>
                  <select
                    value={form.status || "Active"}
                    onChange={(e) => setForm({ ...form, status: e.target.value as StudentStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {STUDENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Class Schedule & Timing */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-emerald dark:text-brand-gold" />
                  <span className="font-bold text-xs uppercase tracking-wider text-brand-deep dark:text-brand-gold">
                    Class Schedule & Timings (کلاس کی ٹائمنگ اور دن)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Class Time (ٹائمنگ)</label>
                    <input
                      type="text"
                      placeholder="e.g. 05:00 PM (PKT)"
                      value={form.classTime || ""}
                      onChange={(e) => setForm({ ...form, classTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Class Days (دن)</label>
                    <input
                      type="text"
                      placeholder="e.g. Mon, Wed, Fri"
                      value={form.classDays || ""}
                      onChange={(e) => setForm({ ...form, classDays: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Duration (دورانیہ)</label>
                    <select
                      value={form.classDuration || "30 mins"}
                      onChange={(e) => setForm({ ...form, classDuration: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16]"
                    >
                      <option value="30 mins">30 mins</option>
                      <option value="45 mins">45 mins</option>
                      <option value="60 mins">60 mins</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Live Class Meeting Link (Zoom / Google Meet URL)</label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                    value={form.meetingLink || ""}
                    onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16]"
                  />
                </div>
              </div>

              {/* Student Portal Login Credentials */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      Student Portal Login (اسٹوڈنٹ پورٹل لاگ ان اور پاسورڈ)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={generateStudentPassword}
                    className="text-[11px] font-bold text-brand-emerald hover:underline flex items-center gap-1"
                  >
                    Generate Credentials
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Portal Username / Login ID</label>
                    <input
                      type="text"
                      placeholder="e.g. muawwaz or student123"
                      value={form.portalUsername || ""}
                      onChange={(e) => setForm({ ...form, portalUsername: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Portal Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter or generate password"
                        value={form.portalPassword || ""}
                        onChange={(e) => setForm({ ...form, portalPassword: e.target.value })}
                        className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">
                  طالب علم یا والدین اس یوزرنیم اور پاسورڈ کے ذریعے <span className="font-mono text-brand-emerald">/portal/student</span> پر لاگ ان ہو کر اپنی کلاس کی ٹائمنگ اور پروفائل دیکھ سکیں گے۔
                </p>
              </div>

              <div>
                <label className="font-semibold block mb-1">Administrative Notes</label>
                <textarea
                  rows={3}
                  value={form.adminNotes || ""}
                  onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-emerald-900">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold"
                >
                  {saving ? "Saving..." : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Drawer/Modal */}
      {profileView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-xl w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-deep text-brand-gold flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold">{profileView.fullName}</h3>
                  <p className="text-xs text-gray-500">
                    {profileView.status} • Enrolled {profileView.enrollmentDate}
                  </p>
                </div>
              </div>
              <button onClick={() => setProfileView(null)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 dark:bg-[#081d16] p-4 rounded-2xl border border-gray-100 dark:border-emerald-900/40">
              <div>
                <span className="text-gray-400 block">Parent/Guardian</span>
                <span className="font-semibold">{profileView.parentName || "—"}</span>
              </div>
              <div>
                <span className="text-gray-400 block">WhatsApp</span>
                <span className="font-semibold">{profileView.whatsappNumber}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Email</span>
                <span className="font-semibold">{profileView.email || "—"}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Country & Time Zone</span>
                <span className="font-semibold">
                  {profileView.country} ({profileView.timeZone})
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Selected Course</span>
                <span className="font-semibold text-brand-emerald dark:text-brand-gold">
                  {profileView.selectedCourse}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Assigned Teacher</span>
                <span className="font-semibold">{profileView.assignedTeacherName || "Unassigned"}</span>
              </div>
              <div className="col-span-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-gray-500 dark:text-emerald-300 block font-bold mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Class Schedule & Timing
                </span>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                  {profileView.classTime || "Timing not set"} • {profileView.classDays || "Days not set"} ({profileView.classDuration || "30 mins"})
                </p>
                {profileView.meetingLink && (
                  <a
                    href={profileView.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                  >
                    <Video className="w-3 h-3" /> Join Live Class
                  </a>
                )}
              </div>
              <div className="col-span-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" /> Student Portal Login Credentials
                  </span>
                  {profileView.portalUsername && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Humna Academy Portal Login:\nWebsite: https://humnaacademy.com/portal/student\nUsername: ${profileView.portalUsername}\nPassword: ${profileView.portalPassword || "N/A"}`
                        );
                        setCopiedCreds(true);
                        setTimeout(() => setCopiedCreds(false), 2000);
                      }}
                      className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1"
                    >
                      {copiedCreds ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedCreds ? "Copied!" : "Copy for Student"}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Username:</span>
                    <span className="font-mono font-bold">{profileView.portalUsername || "Not set"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Password:</span>
                    <span className="font-mono font-bold">{profileView.portalPassword || "Not set"}</span>
                  </div>
                </div>
              </div>
              {profileView.trialReferenceId && (
                <div className="col-span-2">
                  <span className="text-gray-400 block">Trial History Reference</span>
                  <span className="font-mono font-bold">{profileView.trialReferenceId}</span>
                </div>
              )}
            </div>

            {profileView.adminNotes && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs">
                <span className="font-bold block mb-1">Admin Notes:</span>
                <p>{profileView.adminNotes}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setProfileView(null)}
                className="px-4 py-2 rounded-xl bg-brand-deep text-white text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Student Record"
        message={`Are you sure you want to delete "${deleteTarget?.fullName}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
