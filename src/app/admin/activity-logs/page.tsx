"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Search, Download, ShieldCheck, Loader2, Database } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { exportRecordsToCSV } from "@/lib/csv-export";
import { ActivityLogRecord } from "@/types";

export default function AdminActivityLogsPage() {
  const { showToast, globalSearch } = useAdmin();
  const [logs, setLogs] = useState<ActivityLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/resource/activity-logs", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setLogs(j.items || []);
      }
    } catch {
      showToast("error", "Could not load activity logs.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const modules = Array.from(new Set(logs.map((l) => l.module).filter(Boolean)));
  const q = (search || globalSearch).toLowerCase().trim();

  const filtered = logs.filter((l) => {
    if (moduleFilter !== "All" && l.module !== moduleFilter) return false;
    if (q) {
      const hay = `${l.adminEmail} ${l.adminName} ${l.action} ${l.module} ${l.summary}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <AdminShell
      title="Activity Logs & Backups"
      subtitle="Immutable audit trail of administrative logins, content updates, and security events."
      actions={
        <button
          onClick={() =>
            exportRecordsToCSV(
              "humna-academy-activity-logs",
              [
                { key: "timestamp", label: "Timestamp" },
                { key: "adminName", label: "Admin Name" },
                { key: "adminEmail", label: "Admin Email" },
                { key: "action", label: "Action" },
                { key: "module", label: "Module" },
                { key: "recordId", label: "Record ID" },
                { key: "summary", label: "Summary" },
              ],
              filtered
            )
          }
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-semibold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit CSV</span>
        </button>
      }
    >
      {/* Backup & Recovery Strategy Card */}
      <div className="bg-white dark:bg-[#0b231b] p-5 rounded-2xl border border-brand-gold/40 shadow-sm space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-brand-deep dark:text-brand-gold text-sm">
          <Database className="w-4 h-4" />
          <span>Firestore & Storage Backup & Recovery Strategy</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          1. <strong>CSV Exports:</strong> Export Students, Trial Requests, Messages, and Audit Logs regularly via the CSV buttons in each module.{" "}
          2. <strong>Scheduled Managed Backups:</strong> In Google Cloud Console → Firestore → Backups, enable automated daily/weekly Cloud Firestore backups to a Google Cloud Storage bucket (`gs://humna-academy-backups`).{" "}
          3. <strong>Point-in-Time Recovery (PITR):</strong> Enable PITR in Firestore settings to recover accidentally deleted documents within 7 days.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0b231b] p-4 rounded-2xl border border-gray-200 dark:border-emerald-900/50 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by admin email, action, or summary..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
        >
          <option value="All">All Modules</option>
          {modules.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Table */}
      <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#081d16] border-b border-gray-200 dark:border-emerald-900/60 uppercase text-[10px] text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3.5 font-bold">Timestamp</th>
                <th className="px-4 py-3.5 font-bold">Administrator</th>
                <th className="px-4 py-3.5 font-bold">Action & Module</th>
                <th className="px-4 py-3.5 font-bold">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/40">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
                    Loading audit logs...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/70 dark:hover:bg-emerald-950/30">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900 dark:text-white block">
                        {log.adminName}
                      </span>
                      <span className="text-[11px] text-gray-500">{log.adminEmail}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-bold text-brand-emerald dark:text-brand-gold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{log.action}</span>
                      </span>
                      <span className="block text-[11px] text-gray-500">
                        Module: {log.module} {log.recordId ? `(${log.recordId})` : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{log.summary}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
