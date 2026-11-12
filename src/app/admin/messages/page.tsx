"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Search, Download, MessageCircle, Mail, Trash2, Eye, X, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { exportRecordsToCSV } from "@/lib/csv-export";
import { ContactMessageRecord, ContactMessageStatus } from "@/types";

const MSG_STATUSES: ContactMessageStatus[] = ["New", "Read", "Replied", "Archived"];

export default function AdminMessagesPage() {
  const { showToast, globalSearch } = useAdmin();
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selected, setSelected] = useState<ContactMessageRecord | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ContactMessageRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/resource/messages", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setMessages(j.items || []);
      }
    } catch {
      showToast("error", "Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const updateStatus = async (id: string, status: ContactMessageStatus) => {
    const res = await fetch("/api/admin/resource/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
      showToast("success", `Message marked as ${status}.`);
    }
  };

  const openMessage = async (msg: ContactMessageRecord) => {
    setSelected(msg);
    setNotes(msg.internalNotes || "");
    if (msg.status === "New") {
      await updateStatus(msg.id, "Read");
    }
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/resource/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          internalNotes: notes,
          status: selected.status,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      showToast("success", "Message updated.");
      setSelected(null);
      await loadMessages();
    } catch {
      showToast("error", "Could not save notes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resource/messages?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      showToast("success", "Message deleted.");
      setDeleteTarget(null);
      await loadMessages();
    } catch {
      showToast("error", "Failed to delete message.");
    } finally {
      setDeleting(false);
    }
  };

  const q = (search || globalSearch).toLowerCase().trim();
  const filtered = messages.filter((m) => {
    if (statusFilter !== "All" && m.status !== statusFilter) return false;
    if (q) {
      const hay = `${m.name} ${m.email || ""} ${m.phone} ${m.subject} ${m.message}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <AdminShell
      title="Contact Messages"
      subtitle="Review and reply to website contact inquiries."
      actions={
        <button
          onClick={() =>
            exportRecordsToCSV(
              "humna-academy-messages",
              [
                { key: "name", label: "Sender" },
                { key: "phone", label: "Phone/WhatsApp" },
                { key: "email", label: "Email" },
                { key: "subject", label: "Subject" },
                { key: "message", label: "Message" },
                { key: "status", label: "Status" },
                { key: "createdAt", label: "Date" },
              ],
              filtered
            )
          }
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-semibold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      }
    >
      <div className="bg-white dark:bg-[#0b231b] p-4 rounded-2xl border border-gray-200 dark:border-emerald-900/50 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sender, phone, subject, message..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
        >
          <option value="All">All Statuses</option>
          {MSG_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#081d16] border-b border-gray-200 dark:border-emerald-900/60 uppercase text-[10px] text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3.5 font-bold">Sender</th>
                <th className="px-4 py-3.5 font-bold">Subject & Message</th>
                <th className="px-4 py-3.5 font-bold">Date</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
                    Loading messages...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No contact messages received yet.
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-gray-50/70 dark:hover:bg-emerald-950/30 ${
                      msg.status === "New" ? "bg-emerald-50/30 dark:bg-emerald-950/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-gray-900 dark:text-white block">{msg.name}</span>
                      <span className="text-[11px] text-gray-500 block">{msg.phone}</span>
                      {msg.email && <span className="text-[10px] text-gray-400">{msg.email}</span>}
                    </td>
                    <td className="px-4 py-3.5 max-w-md">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                        {msg.subject}
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">{msg.message}</p>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={msg.status}
                        onChange={(e) => updateStatus(msg.id, e.target.value as ContactMessageStatus)}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16] text-xs font-semibold"
                      >
                        {MSG_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openMessage(msg)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white"
                          title="Read & Reply"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(msg)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                          title="Delete"
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

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold">{selected.subject}</h3>
                <p className="text-gray-500">
                  From: {selected.name} ({selected.phone})
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-100 dark:border-emerald-900/40 leading-relaxed text-sm">
              {selected.message}
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Status</label>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    setSelected({ ...selected, status: e.target.value as ContactMessageStatus })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                >
                  {MSG_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Internal Admin Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${String(selected.phone || "").replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] text-white font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold"
                >
                  {saving ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Contact Message"
        message={`Are you sure you want to delete the message from "${deleteTarget?.name}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
