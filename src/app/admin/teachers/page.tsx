"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, X, Loader2, ShieldAlert, Key, Copy, Check, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Course, TeacherProfile } from "@/types";

const EMPTY_TEACHER: Partial<TeacherProfile> = {
  name: "",
  englishName: "",
  urduName: "",
  gender: "Male",
  title: "Quran & Tajweed Instructor",
  photoUrl: "",
  bio: "",
  qualifications: [],
  experienceYears: "",
  specialization: [],
  languages: ["English", "Urdu"],
  availability: "Flexible international slots",
  assignedCourses: [],
  isPlaceholder: false,
  status: "published",
  active: true,
  displayOrder: 1,
  portalUsername: "",
  portalPassword: "",
  phone: "",
  email: "",
};

export default function AdminTeachersPage() {
  const { showToast, globalSearch } = useAdmin();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState<Partial<TeacherProfile>>(EMPTY_TEACHER);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const generateTeacherPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let pass = "HT@";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({
      ...prev,
      portalPassword: pass,
      portalUsername:
        prev.portalUsername ||
        (prev.name
          ? prev.name.toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(10 + Math.random() * 90)
          : "teacher" + Math.floor(100 + Math.random() * 900)),
    }));
  };

  const [deleteTarget, setDeleteTarget] = useState<TeacherProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        fetch("/api/admin/resource/teachers", { cache: "no-store" }),
        fetch("/api/admin/resource/courses", { cache: "no-store" }),
      ]);
      if (tRes.ok) {
        const j = await tRes.json();
        setTeachers(j.items || []);
      }
      if (cRes.ok) {
        const j = await cRes.json();
        setCourses(j.items || []);
      }
    } catch {
      showToast("error", "Could not load teacher roster.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = form.englishName || form.name || "";
    if (!displayName) {
      showToast("error", "Teacher full name is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        name: displayName,
        englishName: displayName,
        isPlaceholder: false, // Verified real teacher added by admin
      };
      const res = await fetch("/api/admin/resource/teachers", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", `Teacher profile "${displayName}" saved.`);
      setModalOpen(false);
      await loadData();
    } catch {
      showToast("error", "Failed to save teacher profile.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (teacher: TeacherProfile) => {
    if (teacher.isPlaceholder && teacher.status !== "published") {
      showToast(
        "error",
        "Placeholder profiles cannot be published directly. Please edit and enter genuine verified details first."
      );
      return;
    }
    const nextStatus = teacher.status === "published" ? "draft" : "published";
    const res = await fetch("/api/admin/resource/teachers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: teacher.id, status: nextStatus, active: nextStatus === "published" }),
    });
    if (res.ok) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === teacher.id ? { ...t, status: nextStatus, active: nextStatus === "published" } : t
        )
      );
      showToast("success", `Teacher ${nextStatus === "published" ? "published to website" : "unpublished"}.`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resource/teachers?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "Teacher profile deleted.");
      setDeleteTarget(null);
      await loadData();
    } catch {
      showToast("error", "Could not delete teacher.");
    } finally {
      setDeleting(false);
    }
  };

  const q = globalSearch.toLowerCase().trim();
  const filtered = teachers.filter((t) =>
    q ? `${t.name} ${t.title} ${t.urduName || ""}`.toLowerCase().includes(q) : true
  );

  return (
    <AdminShell
      title="Teacher Management"
      subtitle="Add verified male and female Quran teachers, upload photos, and control public visibility."
      actions={
        <button
          onClick={() => {
            setIsNew(true);
            setForm({ ...EMPTY_TEACHER, displayOrder: teachers.length + 1 });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Teacher</span>
        </button>
      }
    >
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <p className="leading-relaxed">
          <strong>Verification Policy:</strong> Only publish genuine teacher profiles with verified qualifications and consent. Placeholder templates remain hidden as Drafts unless replaced with authentic instructor data.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
          Loading teachers...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 p-12 text-center text-xs text-gray-500">
          No teacher profiles in Firebase yet. Click &quot;Add Verified Teacher&quot; to publish your first instructor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {teacher.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={teacher.photoUrl}
                        alt={teacher.name}
                        className="w-12 h-12 rounded-xl object-cover border border-brand-gold/40"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-brand-deep text-brand-gold font-bold flex items-center justify-center">
                        {teacher.name?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {teacher.name}
                      </h3>
                      <p className="text-[11px] text-brand-emerald dark:text-brand-gold font-medium">
                        {teacher.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePublish(teacher)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      teacher.status === "published"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {teacher.status === "published" ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                    <span>{teacher.status === "published" ? "Published" : "Draft"}</span>
                  </button>
                </div>

                {teacher.isPlaceholder && (
                  <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Placeholder Profile
                  </span>
                )}

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
                  {teacher.bio}
                </p>

                <div className="text-[11px] text-gray-500 space-y-1">
                  <p>
                    <strong>Gender:</strong> {teacher.gender} • <strong>Exp:</strong>{" "}
                    {teacher.experienceYears}
                  </p>
                  <p>
                    <strong>Languages:</strong> {(teacher.languages || []).join(", ")}
                  </p>
                  {teacher.portalUsername && (
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono flex items-center gap-1">
                      <Key className="w-3 h-3" /> Portal ID: <strong>{teacher.portalUsername}</strong>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-emerald-900/50">
                <span className="text-[10px] text-gray-400">Order #{teacher.displayOrder || 1}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setForm(teacher);
                      setModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(teacher)}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-600 hover:text-white text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <h3 className="font-serif text-xl font-bold">
                {isNew ? "Add Verified Teacher" : "Edit Teacher Profile"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={form.englishName || form.name || ""}
                    onChange={(e) =>
                      setForm({ ...form, englishName: e.target.value, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Urdu Name (Optional)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.urduName || ""}
                    onChange={(e) => setForm({ ...form, urduName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Title / Role</label>
                  <input
                    type="text"
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Gender</label>
                  <select
                    value={form.gender || "Male"}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as "Male" | "Female" })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Teaching Experience</label>
                  <input
                    type="text"
                    value={form.experienceYears || ""}
                    onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                    placeholder="e.g. 6 Years Online"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Availability Slots</label>
                  <input
                    type="text"
                    value={form.availability || ""}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
              </div>

              <ImageUploader
                value={form.photoUrl || ""}
                onChange={(url) => setForm({ ...form, photoUrl: url })}
                folder="teachers"
                label="Teacher Profile Photo (Optional)"
              />

              <div>
                <label className="font-semibold block mb-1">Professional Biography</label>
                <textarea
                  rows={3}
                  value={form.bio || ""}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Qualifications (1 per line)</label>
                  <textarea
                    rows={3}
                    value={(form.qualifications || []).join("\n")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        qualifications: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Specializations (comma separated)</label>
                  <input
                    type="text"
                    value={(form.specialization || []).join(", ")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specialization: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] mb-3"
                  />
                  <label className="font-semibold block mb-1">Languages (comma separated)</label>
                  <input
                    type="text"
                    value={(form.languages || []).join(", ")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
              </div>

              {/* Teacher Portal Login Credentials */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      Teacher Portal Login (ٹیچر پورٹل لاگ ان اور پاسورڈ)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={generateTeacherPassword}
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
                      placeholder="e.g. qari.ahmad or teacher1"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Teacher WhatsApp / Phone</label>
                    <input
                      type="text"
                      placeholder="+92 300 1234567"
                      value={form.phone || ""}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Teacher Email</label>
                    <input
                      type="email"
                      placeholder="teacher@humnaacademy.com"
                      value={form.email || ""}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">
                  اساتذہ اس یوزرنیم اور پاسورڈ سے <span className="font-mono text-brand-emerald">/portal/teacher</span> پر لاگ ان ہو کر اپنے تمام تفویض کردہ طلباء، ان کی کلاس کی ٹائمنگ اور شیڈول دیکھ سکیں گے۔
                </p>
              </div>

              {courses.length > 0 && (
                <div>
                  <label className="font-semibold block mb-1">Assigned Courses</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2.5 rounded-xl border border-gray-200 dark:border-emerald-800">
                    {courses.map((c) => {
                      const checked = (form.assignedCourses || []).includes(c.title);
                      return (
                        <label key={c.id} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const current = form.assignedCourses || [];
                              setForm({
                                ...form,
                                assignedCourses: e.target.checked
                                  ? [...current, c.title]
                                  : current.filter((x) => x !== c.title),
                              });
                            }}
                          />
                          <span className="truncate">{c.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-emerald-900">
                <select
                  value={form.status || "published"}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as "published" | "draft" })
                  }
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                >
                  <option value="published">Published on Website</option>
                  <option value="draft">Draft / Hidden</option>
                </select>

                <div className="flex items-center gap-2">
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
                    {saving ? "Saving..." : "Save Teacher"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Teacher Profile"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
