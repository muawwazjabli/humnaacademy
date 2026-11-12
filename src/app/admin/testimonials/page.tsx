"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, Edit3, Trash2, Check, X, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { TestimonialRecord } from "@/types";

const EMPTY_TESTIMONIAL: Partial<TestimonialRecord> = {
  name: "",
  country: "",
  text: "",
  profileImage: "",
  courseName: "",
  rating: 5,
  approvalStatus: "approved",
  status: "published",
};

export default function AdminTestimonialsPage() {
  const { showToast, globalSearch } = useAdmin();
  const [items, setItems] = useState<TestimonialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState<Partial<TestimonialRecord>>(EMPTY_TESTIMONIAL);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<TestimonialRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/resource/testimonials", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setItems(j.items || []);
      }
    } catch {
      showToast("error", "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text) {
      showToast("error", "Parent/student name and testimonial text are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/resource/testimonials", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Testimonial saved.");
      setModalOpen(false);
      await loadData();
    } catch {
      showToast("error", "Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const updateState = async (
    item: TestimonialRecord,
    updates: Partial<TestimonialRecord>,
    msg: string
  ) => {
    const res = await fetch("/api/admin/resource/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, ...updates }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, ...updates } : x)));
      showToast("success", msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resource/testimonials?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      showToast("success", "Testimonial deleted.");
      setDeleteTarget(null);
      await loadData();
    } catch {
      showToast("error", "Could not delete testimonial.");
    } finally {
      setDeleting(false);
    }
  };

  const q = globalSearch.toLowerCase().trim();
  const filtered = items.filter((i) =>
    q ? `${i.name} ${i.country} ${i.text} ${i.courseName}`.toLowerCase().includes(q) : true
  );

  return (
    <AdminShell
      title="Testimonial Management"
      subtitle="Approve, publish, and curate verified parent & student feedback."
      actions={
        <button
          onClick={() => {
            setIsNew(true);
            setForm(EMPTY_TESTIMONIAL);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Testimonial</span>
        </button>
      }
    >
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-brand-emerald" />
        <p>
          <strong>Authenticity Standard:</strong> Only publish genuine feedback provided by verified parents or students with permission. If no published testimonials exist, the homepage safely displays the verification notice.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
          Loading testimonials...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 p-12 text-center text-xs text-gray-500">
          No testimonials added yet. Click &quot;Add Verified Testimonial&quot; when you have authentic feedback ready to publish.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-[11px] text-gray-500">
                      {item.country} • {item.courseName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.approvalStatus === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.approvalStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.approvalStatus}
                  </span>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  &quot;{item.text}&quot;
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-emerald-900/50">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateState(item, { approvalStatus: "approved" }, "Testimonial approved.")}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                    title="Approve"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      updateState(item, { approvalStatus: "rejected", status: "draft" }, "Testimonial rejected.")
                    }
                    className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white"
                    title="Reject"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      updateState(
                        item,
                        { status: item.status === "published" ? "draft" : "published" },
                        item.status === "published" ? "Unpublished." : "Published to website."
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-emerald-950 text-[11px] font-semibold inline-flex items-center gap-1"
                  >
                    {item.status === "published" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{item.status === "published" ? "Published" : "Draft"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setForm(item);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
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
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <h3 className="font-serif text-xl font-bold">
                {isNew ? "Add Authentic Testimonial" : "Edit Testimonial"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Parent / Student Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Country</label>
                  <input
                    type="text"
                    value={form.country || ""}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="e.g. United Kingdom"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Course Name</label>
                  <input
                    type="text"
                    value={form.courseName || ""}
                    onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Rating (Optional)</label>
                  <select
                    value={form.rating || 5}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ImageUploader
                value={form.profileImage || ""}
                onChange={(url) => setForm({ ...form, profileImage: url })}
                folder="testimonials"
                label="Profile Photo (Optional)"
              />

              <div>
                <label className="font-semibold block mb-1">Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={form.text || ""}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Approval Status</label>
                  <select
                    value={form.approvalStatus || "approved"}
                    onChange={(e) =>
                      setForm({ ...form, approvalStatus: e.target.value as TestimonialRecord["approvalStatus"] })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Publication</label>
                  <select
                    value={form.status || "published"}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as "published" | "draft" })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  {saving ? "Saving..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.name}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
