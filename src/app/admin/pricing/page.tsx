"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, Star, X, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { PricingPlan } from "@/types";

const EMPTY_PLAN: Partial<PricingPlan> = {
  name: "",
  shortDescription: "",
  classesPerWeek: 3,
  durationMinutes: 30,
  monthlyFees: {
    USD: "Contact us",
    GBP: "Contact us",
    CAD: "Contact us",
    AUD: "Contact us",
    PKR: "Contact us",
  },
  features: ["3 one-to-one classes per week", "30 minutes per session"],
  isPopular: false,
  customPricingNote: "",
  status: "published",
  displayOrder: 1,
};

export default function AdminPricingPage() {
  const { showToast } = useAdmin();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState<Partial<PricingPlan>>(EMPTY_PLAN);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<PricingPlan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/resource/pricing", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setPlans(j.items || []);
      }
    } catch {
      showToast("error", "Failed to load pricing plans.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      showToast("error", "Plan name is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/resource/pricing", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", `Pricing plan "${form.name}" saved.`);
      setModalOpen(false);
      await loadPlans();
    } catch {
      showToast("error", "Could not save pricing plan.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (plan: PricingPlan) => {
    const nextStatus = plan.status === "draft" ? "published" : "draft";
    const res = await fetch("/api/admin/resource/pricing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: plan.id, status: nextStatus }),
    });
    if (res.ok) {
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, status: nextStatus } : p)));
      showToast("success", `Plan ${nextStatus === "published" ? "published" : "unpublished"}.`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resource/pricing?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      showToast("success", "Pricing plan deleted.");
      setDeleteTarget(null);
      await loadPlans();
    } catch {
      showToast("error", "Could not delete plan.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminShell
      title="Pricing Management"
      subtitle="Manage monthly plans and manual currency pricing (USD, GBP, CAD, AUD, PKR)."
      actions={
        <button
          onClick={() => {
            setIsNew(true);
            setForm({ ...EMPTY_PLAN, displayOrder: plans.length + 1 });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pricing Plan</span>
        </button>
      }
    >
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
          Loading pricing plans...
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 p-12 text-center text-xs text-gray-500">
          No pricing plans in Firestore yet. Sync default content from Dashboard or click &quot;Add Pricing Plan&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-[#0b231b] rounded-2xl border p-6 shadow-sm flex flex-col justify-between space-y-5 ${
                plan.isPopular
                  ? "border-brand-gold ring-2 ring-brand-gold/25"
                  : "border-gray-200 dark:border-emerald-900/50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                        {plan.name}
                      </h3>
                      {plan.isPopular && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-goldDark dark:text-brand-gold text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-current" /> Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {plan.classesPerWeek} classes/week • {plan.durationMinutes} min/class
                    </p>
                  </div>

                  <button
                    onClick={() => togglePublish(plan)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      plan.status !== "draft"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {plan.status !== "draft" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{plan.status !== "draft" ? "Live" : "Draft"}</span>
                  </button>
                </div>

                {/* Currencies Grid */}
                <div className="grid grid-cols-5 gap-1.5 text-center bg-gray-50 dark:bg-[#081d16] p-2.5 rounded-xl border border-gray-100 dark:border-emerald-900/40 text-[11px]">
                  <div>
                    <span className="text-gray-400 block text-[9px]">USD</span>
                    <span className="font-bold">${plan.monthlyFees?.USD}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">GBP</span>
                    <span className="font-bold">£{plan.monthlyFees?.GBP}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">CAD</span>
                    <span className="font-bold">C${plan.monthlyFees?.CAD}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">AUD</span>
                    <span className="font-bold">A${plan.monthlyFees?.AUD}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">PKR</span>
                    <span className="font-bold">{plan.monthlyFees?.PKR}</span>
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                  {(plan.features || []).slice(0, 4).map((f, idx) => (
                    <li key={idx} className="truncate">
                      • {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-emerald-900/50">
                <span className="text-[10px] text-gray-400">Order #{plan.displayOrder || 1}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setForm(plan);
                      setModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(plan)}
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
                {isNew ? "Create Pricing Plan" : `Edit Plan: ${form.name}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-semibold block mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={form.displayOrder || 1}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Classes Per Week</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={form.classesPerWeek || 3}
                    onChange={(e) => setForm({ ...form, classesPerWeek: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Session Duration (Mins)</label>
                  <input
                    type="number"
                    min={15}
                    value={form.durationMinutes || 30}
                    onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
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

              {/* Manual Currency Pricing */}
              <div>
                <label className="font-bold block mb-2">
                  Monthly Pricing per Currency (Managed Explicitly — No Auto-Conversion)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(["USD", "GBP", "CAD", "AUD", "PKR"] as const).map((curr) => (
                    <div key={curr}>
                      <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                        {curr}
                      </label>
                      <input
                        type="text"
                        value={form.monthlyFees?.[curr] || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            monthlyFees: {
                              USD: form.monthlyFees?.USD || "",
                              GBP: form.monthlyFees?.GBP || "",
                              CAD: form.monthlyFees?.CAD || "",
                              AUD: form.monthlyFees?.AUD || "",
                              PKR: form.monthlyFees?.PKR || "",
                              [curr]: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. 50 or Contact us"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Plan Features (1 per line)</label>
                <textarea
                  rows={4}
                  value={(form.features || []).join("\n")}
                  onChange={(e) =>
                    setForm({ ...form, features: e.target.value.split("\n").filter(Boolean) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Short Description / Pricing Note</label>
                <input
                  type="text"
                  value={form.customPricingNote || ""}
                  onChange={(e) => setForm({ ...form, customPricingNote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-emerald-900">
                <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(form.isPopular)}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                  />
                  <span>Mark as &quot;Most Popular&quot; Plan</span>
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
                    {saving ? "Saving..." : "Save Plan"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Pricing Plan"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
