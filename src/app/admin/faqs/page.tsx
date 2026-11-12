"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, X, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { FAQItem } from "@/types";

const FAQ_CATEGORIES: FAQItem["category"][] = [
  "Trial & Registration",
  "Courses & Learning",
  "Teachers & Scheduling",
  "Fees & Policies",
  "Technical & Contact",
];

const EMPTY_FAQ: Partial<FAQItem> = {
  category: "Trial & Registration",
  question: "",
  questionUrdu: "",
  answer: "",
  answerUrdu: "",
  isPolicyConfirmed: true,
  status: "published",
  displayOrder: 1,
};

export default function AdminFaqsPage() {
  const { showToast, globalSearch } = useAdmin();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState<Partial<FAQItem>>(EMPTY_FAQ);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FAQItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/resource/faqs", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setFaqs(j.items || []);
      }
    } catch {
      showToast("error", "Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.answer) {
      showToast("error", "Question and Answer in English are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/resource/faqs", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "FAQ saved and updated on website.");
      setModalOpen(false);
      await loadFaqs();
    } catch {
      showToast("error", "Could not save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (faq: FAQItem) => {
    const nextStatus = faq.status === "draft" ? "published" : "draft";
    const res = await fetch("/api/admin/resource/faqs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: faq.id, status: nextStatus }),
    });
    if (res.ok) {
      setFaqs((prev) => prev.map((f) => (f.id === faq.id ? { ...f, status: nextStatus } : f)));
      showToast("success", `FAQ ${nextStatus === "published" ? "published" : "unpublished"}.`);
    }
  };

  const moveOrder = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= faqs.length) return;
    await Promise.all([
      fetch("/api/admin/resource/faqs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: faqs[index].id, displayOrder: target + 1 }),
      }),
      fetch("/api/admin/resource/faqs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: faqs[target].id, displayOrder: index + 1 }),
      }),
    ]);
    await loadFaqs();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resource/faqs?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "FAQ deleted.");
      setDeleteTarget(null);
      await loadFaqs();
    } catch {
      showToast("error", "Could not delete FAQ.");
    } finally {
      setDeleting(false);
    }
  };

  const q = globalSearch.toLowerCase().trim();
  const filtered = faqs.filter((f) =>
    q ? `${f.question} ${f.questionUrdu || ""} ${f.answer} ${f.category}`.toLowerCase().includes(q) : true
  );

  return (
    <AdminShell
      title="FAQ Management"
      subtitle="Manage bilingual English & Urdu frequently asked questions."
      actions={
        <button
          onClick={() => {
            setIsNew(true);
            setForm({ ...EMPTY_FAQ, displayOrder: faqs.length + 1 });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      }
    >
      <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-emerald-900/40">
          {loading ? (
            <div className="p-12 text-center text-xs">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
              Loading FAQs...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No FAQs found in Firestore yet.
            </div>
          ) : (
            filtered.map((faq, idx) => (
              <div
                key={faq.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/70 dark:hover:bg-emerald-950/30"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-gray-400">
                      #{faq.displayOrder || idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-cream dark:bg-emerald-950 text-[10px] font-bold text-brand-deep dark:text-brand-gold">
                      {faq.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{faq.question}</h4>
                  {faq.questionUrdu && (
                    <p className="font-urdu text-xs text-brand-emerald dark:text-brand-gold">
                      {faq.questionUrdu}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => moveOrder(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveOrder(idx, 1)}
                    disabled={idx === filtered.length - 1}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => togglePublish(faq)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 ${
                      faq.status !== "draft"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {faq.status !== "draft" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{faq.status !== "draft" ? "Live" : "Draft"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setForm(faq);
                      setModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(faq)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <h3 className="font-serif text-xl font-bold">{isNew ? "Add FAQ" : "Edit FAQ"}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={form.category || "Trial & Registration"}
                    onChange={(e) => setForm({ ...form, category: e.target.value as FAQItem["category"] })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {FAQ_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Status</label>
                  <select
                    value={form.status || "published"}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Question (English) *</label>
                <input
                  type="text"
                  required
                  value={form.question || ""}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Question (Urdu)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={form.questionUrdu || ""}
                  onChange={(e) => setForm({ ...form, questionUrdu: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Answer (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={form.answer || ""}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Answer (Urdu)</label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={form.answerUrdu || ""}
                  onChange={(e) => setForm({ ...form, answerUrdu: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(form.isPolicyConfirmed)}
                    onChange={(e) => setForm({ ...form, isPolicyConfirmed: e.target.checked })}
                  />
                  <span>Confirmed Academy Policy</span>
                </label>

                <div className="flex gap-2">
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
                    {saving ? "Saving..." : "Save FAQ"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete FAQ"
        message={`Are you sure you want to delete "${deleteTarget?.question}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
