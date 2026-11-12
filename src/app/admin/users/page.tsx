"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, ShieldCheck, Edit3, Power, X, Loader2, AlertCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { AdminRole, AdminUser } from "@/types";

const ALL_MODULES = [
  { id: "courses", label: "Courses" },
  { id: "students", label: "Students" },
  { id: "teachers", label: "Teachers" },
  { id: "trialRequests", label: "Trial Requests" },
  { id: "pricing", label: "Pricing Plans" },
  { id: "blogs", label: "Blog CMS" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faqs", label: "FAQs" },
  { id: "gallery", label: "Gallery" },
  { id: "messages", label: "Contact Messages" },
  { id: "websiteContent", label: "Website Content" },
];

export default function AdminUsersPage() {
  const { admin, showToast } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [hasServiceAccount, setHasServiceAccount] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState<{
    uid?: string;
    name: string;
    email: string;
    password?: string;
    existingUid?: string;
    role: AdminRole;
    permissions: string[];
  }>({
    name: "",
    email: "",
    password: "",
    existingUid: "",
    role: "admin",
    permissions: ["courses", "trialRequests", "students", "teachers", "blogs"],
  });
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setUsers(j.items || []);
        setHasServiceAccount(Boolean(j.hasServiceAccount));
      }
    } catch {
      showToast("error", "Could not load administrators.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (admin?.role === "super_admin") {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [admin, loadUsers]);

  if (admin && admin.role !== "super_admin") {
    return (
      <AdminShell title="Access Restricted">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="font-bold text-lg text-red-900 dark:text-red-200">
            Super Admin Access Required
          </h3>
          <p className="text-xs text-red-700 dark:text-red-300">
            Only the Super Admin can manage administrator accounts, roles, and permissions.
          </p>
        </div>
      </AdminShell>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Operation failed");
      showToast("success", isNew ? "Administrator added." : "Administrator permissions updated.");
      setModalOpen(false);
      await loadUsers();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update admin user.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u: AdminUser) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: u.uid, active: !u.active }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      showToast("success", `Admin ${u.active ? "deactivated" : "activated"}.`);
      await loadUsers();
    } catch (err: any) {
      showToast("error", err?.message || "Action failed.");
    }
  };

  return (
    <AdminShell
      title="Admin Users & Roles"
      subtitle="Control role-based access (Super Admin, Admin, Editor) and monitor account status."
      actions={
        <button
          onClick={() => {
            setIsNew(true);
            setForm({
              name: "",
              email: "",
              password: "",
              existingUid: "",
              role: "admin",
              permissions: ["courses", "trialRequests", "students", "teachers", "blogs"],
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Authorized Admin</span>
        </button>
      }
    >
      {!hasServiceAccount && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <p className="font-bold">Firebase Service Account Note:</p>
          <p>
            To create brand-new Firebase Auth accounts directly from this form with Custom Claims, add <code>FIREBASE_CLIENT_EMAIL</code> and <code>FIREBASE_PRIVATE_KEY</code> in Vercel Environment Variables. Otherwise, create the user in Firebase Authentication Console first and enter their <strong>User UID</strong> below.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#081d16] border-b border-gray-200 dark:border-emerald-900/60 uppercase text-[10px] text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3.5 font-bold">Administrator</th>
                <th className="px-4 py-3.5 font-bold">Role</th>
                <th className="px-4 py-3.5 font-bold">Last Login</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
                    Loading administrators...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No admin records returned.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.uid} className="hover:bg-gray-50/70 dark:hover:bg-emerald-950/30">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-gray-900 dark:text-white block">{u.name}</span>
                      <span className="text-[11px] text-gray-500 block">{u.email}</span>
                      <span className="text-[10px] font-mono text-gray-400">UID: {u.uid}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-cream dark:bg-emerald-950 text-brand-deep dark:text-brand-gold font-bold uppercase text-[10px]">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{u.role.replace("_", " ")}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.active !== false
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.active !== false ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setIsNew(false);
                            setForm({
                              uid: u.uid,
                              name: u.name,
                              email: u.email,
                              role: u.role,
                              permissions: u.permissions || [],
                            });
                            setModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white"
                          title="Edit Role & Permissions"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {u.uid !== admin?.uid && (
                          <button
                            onClick={() => toggleActive(u)}
                            className={`p-2 rounded-lg ${
                              u.active !== false
                                ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                            }`}
                            title={u.active !== false ? "Deactivate" : "Activate"}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <h3 className="font-serif text-xl font-bold">
                {isNew ? "Add Authorized Administrator" : `Edit Admin: ${form.name}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              {isNew && (
                <>
                  <div>
                    <label className="font-semibold block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>

                  {hasServiceAccount ? (
                    <div>
                      <label className="font-semibold block mb-1">Temporary Password (min 8 chars) *</label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={form.password || ""}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="font-semibold block mb-1">
                        Existing Firebase Auth UID *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.existingUid || ""}
                        onChange={(e) => setForm({ ...form, existingUid: e.target.value })}
                        placeholder="Paste UID from Firebase Auth -> Users"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="font-semibold block mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                >
                  <option value="super_admin">Super Admin (Full Control)</option>
                  <option value="admin">Admin (Academy Operations)</option>
                  <option value="editor">Editor (Content, Blogs, FAQs, Gallery)</option>
                </select>
              </div>

              {form.role !== "super_admin" && (
                <div>
                  <label className="font-semibold block mb-2">Module Permissions</label>
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-gray-50 dark:bg-[#081d16] border border-gray-200 dark:border-emerald-800">
                    {ALL_MODULES.map((m) => {
                      const checked = form.permissions.includes(m.id);
                      return (
                        <label key={m.id} className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                permissions: e.target.checked
                                  ? [...form.permissions, m.id]
                                  : form.permissions.filter((x) => x !== m.id),
                              })
                            }
                          />
                          <span>{m.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  {saving ? "Saving..." : "Save Administrator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
