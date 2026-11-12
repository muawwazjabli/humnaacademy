"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Star,
  ExternalLink,
  X,
  Database,
  Loader2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Course } from "@/types";

const CATEGORIES: Course["category"][] = [
  "Foundation",
  "Recitation & Tajweed",
  "Memorization",
  "Islamic Knowledge",
  "Recitation & Rules",
  "Advanced Studies",
];

const LEVELS: Course["level"][] = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const EMPTY_COURSE: Partial<Course> = {
  slug: "",
  title: "",
  titleUrdu: "",
  titleArabic: "",
  category: "Foundation",
  level: "Beginner",
  shortDescription: "",
  fullOverview: "",
  durationFrequency: "Customizable (3 to 5 classes/week)",
  classDuration: "30 Minutes (1-on-1)",
  teacherType: "Male & Female Qualified Teachers",
  prerequisites: "None required",
  suggestedLessonStructure: "30-minute interactive session with revision and new lesson",
  features: ["One-to-one live lessons", "Personalized pace", "Monthly progress feedback"],
  targetAudience: ["Children ages 5+", "Adult beginners"],
  learningObjectives: ["Accurate pronunciation", "Fluent reading"],
  imageUrl: "",
  featured: false,
  iconName: "BookOpen",
  status: "published",
  displayOrder: 1,
};

export default function AdminCoursesPage() {
  const { showToast, globalSearch } = useAdmin();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Course>>(EMPTY_COURSE);
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/resource/courses", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setCourses(j.items || []);
      }
    } catch {
      showToast("error", "Could not load courses.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handlePreload = async () => {
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast("success", `Preloaded ${json.seeded.courses} Humna Academy courses to Firebase.`);
      await loadCourses();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to preload courses.");
    }
  };

  const openNew = () => {
    setIsNew(true);
    setEditing({ ...EMPTY_COURSE, displayOrder: courses.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setIsNew(false);
    setEditing({
      ...course,
      features: course.features || [],
      targetAudience: course.targetAudience || [],
      learningObjectives: course.learningObjectives || [],
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing.title) {
      showToast("error", "Course English title is required.");
      return;
    }

    const computedSlug =
      editing.slug?.trim() ||
      editing.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    setSaving(true);
    try {
      const payload = {
        ...editing,
        id: editing.id || computedSlug,
        slug: computedSlug,
        curriculum: editing.curriculum || [],
        faqs: editing.faqs || [],
      };

      const res = await fetch("/api/admin/resource/courses", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");

      showToast("success", `Course "${editing.title}" saved and synced with website.`);
      setModalOpen(false);
      await loadCourses();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (course: Course) => {
    const nextStatus = course.status === "draft" ? "published" : "draft";
    try {
      const res = await fetch("/api/admin/resource/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: course.id, status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, status: nextStatus } : c))
      );
      showToast("success", `Course ${nextStatus === "published" ? "published" : "unpublished"}.`);
    } catch {
      showToast("error", "Failed to toggle publish status.");
    }
  };

  const toggleFeatured = async (course: Course) => {
    const next = !course.featured;
    try {
      const res = await fetch("/api/admin/resource/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: course.id, featured: next }),
      });
      if (!res.ok) throw new Error("Failed");
      setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, featured: next } : c)));
      showToast("success", next ? "Marked as Featured course." : "Removed from Featured.");
    } catch {
      showToast("error", "Failed to update featured toggle.");
    }
  };

  const moveOrder = async (index: number, dir: -1 | 1) => {
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= courses.length) return;
    const current = courses[index];
    const swapWith = courses[targetIdx];

    const orderA = targetIdx + 1;
    const orderB = index + 1;

    await Promise.all([
      fetch("/api/admin/resource/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: current.id, displayOrder: orderA }),
      }),
      fetch("/api/admin/resource/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: swapWith.id, displayOrder: orderB }),
      }),
    ]);

    await loadCourses();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resource/courses?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", `Course "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await loadCourses();
    } catch {
      showToast("error", "Failed to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  const q = (search || globalSearch).toLowerCase().trim();
  const filtered = courses.filter((c) => {
    if (catFilter !== "All" && c.category !== catFilter) return false;
    if (q) {
      const hay = `${c.title} ${c.titleUrdu || ""} ${c.category} ${c.shortDescription}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <AdminShell
      title="Course Management"
      subtitle="Add, edit, publish, reorder, and customize all Humna Academy courses dynamically."
      actions={
        <>
          {courses.length === 0 && (
            <button
              onClick={handlePreload}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-gold text-brand-deep dark:text-brand-gold text-xs font-bold"
            >
              <Database className="w-4 h-4" />
              <span>Preload 13 Courses</span>
            </button>
          )}
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </>
      }
    >
      {/* Filters */}
      <div className="bg-white dark:bg-[#0b231b] p-4 rounded-2xl border border-gray-200 dark:border-emerald-900/50 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses in English or Urdu..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
          />
        </div>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Course Table */}
      <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#081d16] border-b border-gray-200 dark:border-emerald-900/60 text-gray-600 dark:text-gray-300 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5 font-bold">Order</th>
                <th className="px-4 py-3.5 font-bold">Course</th>
                <th className="px-4 py-3.5 font-bold">Category & Level</th>
                <th className="px-4 py-3.5 font-bold">Featured</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
                    Loading courses...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No courses found in Firestore. Click &quot;Preload 13 Courses&quot; or &quot;Add New Course&quot;.
                  </td>
                </tr>
              ) : (
                filtered.map((course, idx) => (
                  <tr key={course.id} className="hover:bg-gray-50/70 dark:hover:bg-emerald-950/30">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <span className="font-mono font-bold text-gray-500 mr-1">
                          #{course.displayOrder || idx + 1}
                        </span>
                        <button
                          onClick={() => moveOrder(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-emerald-900 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveOrder(idx, 1)}
                          disabled={idx === filtered.length - 1}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-emerald-90 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {course.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                        )}
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">
                            {course.title}
                          </span>
                          <span className="font-urdu text-[11px] text-brand-emerald dark:text-brand-gold block">
                            {course.titleUrdu}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                        {course.category}
                      </span>
                      <span className="text-[11px] text-gray-500">{course.level}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => toggleFeatured(course)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          course.featured
                            ? "bg-amber-50 border-brand-gold text-brand-gold"
                            : "border-gray-200 dark:border-emerald-800 text-gray-400"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${course.featured ? "fill-brand-gold" : ""}`} />
                      </button>
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => togglePublish(course)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          course.status !== "draft"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {course.status !== "draft" ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        <span>{course.status !== "draft" ? "Published" : "Draft"}</span>
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/courses/${course.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-emerald hover:text-white text-gray-600 dark:text-gray-200"
                          title="Preview Live Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEdit(course)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white text-gray-700 dark:text-gray-200"
                          title="Edit Course"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(course)}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-600 hover:text-white text-red-600"
                          title="Delete Course"
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
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <h3 className="font-serif text-xl font-bold">
                {isNew ? "Create New Course" : `Edit Course: ${editing.title}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Course Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editing.title || ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Course Title (Urdu)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editing.titleUrdu || ""}
                    onChange={(e) => setEditing({ ...editing, titleUrdu: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Arabic Title (Optional)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={editing.titleArabic || ""}
                    onChange={(e) => setEditing({ ...editing, titleArabic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-arabic"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={editing.slug || ""}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={editing.category || "Foundation"}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value as Course["category"] })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Difficulty Level</label>
                  <select
                    value={editing.level || "Beginner"}
                    onChange={(e) => setEditing({ ...editing, level: e.target.value as Course["level"] })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Course Duration & Frequency</label>
                  <input
                    type="text"
                    value={editing.durationFrequency || ""}
                    onChange={(e) => setEditing({ ...editing, durationFrequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Class Duration</label>
                  <input
                    type="text"
                    value={editing.classDuration || ""}
                    onChange={(e) => setEditing({ ...editing, classDuration: e.target.value })}
                    placeholder="30 Minutes (1-on-1)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Teacher Type</label>
                  <input
                    type="text"
                    value={editing.teacherType || ""}
                    onChange={(e) => setEditing({ ...editing, teacherType: e.target.value })}
                    placeholder="Male & Female Tutors"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Publication Status</label>
                  <select
                    value={editing.status || "published"}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as "published" | "draft" })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="published">Published (Visible on Website)</option>
                    <option value="draft">Draft / Unpublished</option>
                  </select>
                </div>
              </div>

              <ImageUploader
                value={editing.imageUrl || ""}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
                folder="courses"
                label="Course Thumbnail Image"
              />

              <div>
                <label className="font-semibold block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={editing.shortDescription || ""}
                  onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Full Description / Overview</label>
                <textarea
                  rows={4}
                  required
                  value={editing.fullOverview || ""}
                  onChange={(e) => setEditing({ ...editing, fullOverview: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Learning Objectives (1 per line)</label>
                  <textarea
                    rows={3}
                    value={(editing.learningObjectives || []).join("\n")}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        learningObjectives: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Course Features (1 per line)</label>
                  <textarea
                    rows={3}
                    value={(editing.features || []).join("\n")}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        features: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-emerald-900">
                <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.featured)}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  />
                  <span>Show as Featured Course on Homepage</span>
                </label>

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
                    {saving ? "Saving..." : "Save Course"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? Consider setting it to Draft/Unpublished instead if students are currently enrolled.`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
