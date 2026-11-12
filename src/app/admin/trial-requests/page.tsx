"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Download,
  MessageCircle,
  Mail,
  Eye,
  Trash2,
  Edit3,
  UserPlus,
  X,
  Filter,
  Loader2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { exportRecordsToCSV } from "@/lib/csv-export";
import { TeacherProfile, TrialRequestRecord, TrialStatus } from "@/types";

const TRIAL_STATUSES: TrialStatus[] = [
  "New",
  "Contacted",
  "Scheduled",
  "Trial Completed",
  "Enrolled",
  "Not Interested",
  "Cancelled",
];

function TrialRequestsContent() {
  const { showToast, globalSearch } = useAdmin();
  const searchParams = useSearchParams();
  const initialViewId = searchParams.get("view");

  const [requests, setRequests] = useState<TrialRequestRecord[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [countryFilter, setCountryFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [quickPending, setQuickPending] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [selectedReq, setSelectedReq] = useState<TrialRequestRecord | null>(null);
  const [editForm, setEditForm] = useState<Partial<TrialRequestRecord>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<TrialRequestRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [reqRes, teacherRes] = await Promise.all([
        fetch("/api/admin/resource/trial-requests", { cache: "no-store" }),
        fetch("/api/admin/resource/teachers", { cache: "no-store" }),
      ]);
      if (reqRes.ok) {
        const j = await reqRes.json();
        const items: TrialRequestRecord[] = (j.items || []).map((r: any) => ({
          ...r,
          status:
            !r.status || r.status.toLowerCase() === "new"
              ? "New"
              : r.status,
        }));
        setRequests(items);
        if (initialViewId) {
          const found = items.find((item) => item.id === initialViewId);
          if (found) {
            setSelectedReq(found);
            setEditForm(found);
          }
        }
      }
      if (teacherRes.ok) {
        const t = await teacherRes.json();
        setTeachers(t.items || []);
      }
    } catch {
      showToast("error", "Failed to load trial requests.");
    } finally {
      setLoading(false);
    }
  }, [initialViewId, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const uniqueCourses = Array.from(new Set(requests.map((r) => r.preferredCourse).filter(Boolean)));
  const uniqueCountries = Array.from(new Set(requests.map((r) => r.country).filter(Boolean)));

  const effectiveSearch = (search || globalSearch).toLowerCase().trim();

  const filtered = requests.filter((r) => {
    if (quickPending && !["New", "Contacted", "Scheduled"].includes(r.status)) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (courseFilter !== "All" && r.preferredCourse !== courseFilter) return false;
    if (countryFilter !== "All" && r.country !== countryFilter) return false;
    if (dateFilter && r.createdAt && !r.createdAt.startsWith(dateFilter)) return false;
    if (effectiveSearch) {
      const hay = `${r.fullName} ${r.parentName || ""} ${r.email || ""} ${r.whatsappNumber} ${r.preferredCourse} ${r.country} ${r.referenceId}`.toLowerCase();
      if (!hay.includes(effectiveSearch)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/resource/trial-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedReq.id,
          fullName: editForm.fullName,
          parentName: editForm.parentName,
          email: editForm.email,
          whatsappNumber: editForm.whatsappNumber,
          country: editForm.country,
          timeZone: editForm.timeZone,
          studentAge: editForm.studentAge,
          preferredCourse: editForm.preferredCourse,
          preferredTeacher: editForm.preferredTeacher,
          preferredTime: editForm.preferredTime,
          status: editForm.status,
          assignedTeacherId: editForm.assignedTeacherId || "",
          assignedTeacherName: editForm.assignedTeacherName || "",
          internalNotes: editForm.internalNotes || "",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      showToast("success", "Trial request updated successfully.");
      setSelectedReq(null);
      await loadData();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update request.");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (id: string, status: TrialStatus) => {
    try {
      const res = await fetch("/api/admin/resource/trial-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed");
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      showToast("success", `Status changed to ${status}`);
    } catch {
      showToast("error", "Could not update status.");
    }
  };

  const handleConvertToStudent = async (req: TrialRequestRecord) => {
    try {
      const res = await fetch("/api/admin/resource/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: req.fullName,
          parentName: req.parentName || "",
          email: req.email || "",
          whatsappNumber: req.whatsappNumber,
          country: req.country || "",
          timeZone: req.timeZone || "",
          age: req.studentAge || "",
          selectedCourse: req.preferredCourse,
          assignedTeacherId: req.assignedTeacherId || "",
          assignedTeacherName: req.assignedTeacherName || "",
          enrollmentDate: new Date().toISOString().slice(0, 10),
          status: "Active",
          trialReferenceId: req.referenceId,
          adminNotes: `Converted from Trial Request ${req.referenceId}. ${req.internalNotes || ""}`,
        }),
      });
      if (!res.ok) throw new Error("Conversion failed");
      await handleQuickStatus(req.id, "Enrolled");
      showToast("success", `${req.fullName} converted to an Enrolled Student!`);
    } catch {
      showToast("error", "Could not convert trial to student.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resource/trial-requests?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "Trial request deleted.");
      setDeleteTarget(null);
      if (selectedReq?.id === deleteTarget.id) setSelectedReq(null);
      await loadData();
    } catch {
      showToast("error", "Failed to delete request.");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    exportRecordsToCSV(
      "humna-academy-trial-requests",
      [
        { key: "referenceId", label: "Reference ID" },
        { key: "fullName", label: "Student Name" },
        { key: "parentName", label: "Parent Name" },
        { key: "ageGroup", label: "Age Group" },
        { key: "studentAge", label: "Age" },
        { key: "email", label: "Email" },
        { key: "whatsappNumber", label: "WhatsApp" },
        { key: "country", label: "Country" },
        { key: "timeZone", label: "Time Zone" },
        { key: "preferredCourse", label: "Course" },
        { key: "preferredTeacher", label: "Teacher Pref" },
        { key: "preferredDays", label: "Days" },
        { key: "preferredTime", label: "Preferred Time" },
        { key: "status", label: "Status" },
        { key: "assignedTeacherName", label: "Assigned Teacher" },
        { key: "createdAt", label: "Submitted At" },
      ],
      filtered
    );
  };

  return (
    <AdminShell
      title="Free Trial Requests"
      subtitle="Manage incoming student trial inquiries, assign teachers, and contact via WhatsApp or Email."
      actions={
        <>
          <button
            onClick={() => setQuickPending(!quickPending)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              quickPending
                ? "bg-brand-gold text-brand-deep border-brand-gold"
                : "bg-white dark:bg-[#0b231b] border-gray-200 dark:border-emerald-800 text-gray-700 dark:text-gray-200"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>New & Pending Only</span>
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </>
      }
    >
      {/* Filters Bar */}
      <div className="bg-white dark:bg-[#0b231b] p-4 rounded-2xl border border-gray-200 dark:border-emerald-900/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, phone, ref..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
        >
          <option value="All">All Statuses</option>
          {TRIAL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={courseFilter}
          onChange={(e) => {
            setCourseFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
        >
          <option value="All">All Courses</option>
          {uniqueCourses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={countryFilter}
          onChange={(e) => {
            setCountryFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
        >
          <option value="All">All Countries</option>
          {uniqueCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#081d16] border-b border-gray-200 dark:border-emerald-900/60 text-gray-600 dark:text-gray-300 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5 font-bold">Ref / Student</th>
                <th className="px-4 py-3.5 font-bold">WhatsApp & Email</th>
                <th className="px-4 py-3.5 font-bold">Course & Level</th>
                <th className="px-4 py-3.5 font-bold">Schedule & Country</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
                    Loading requests from Firebase...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No matching trial requests found.
                  </td>
                </tr>
              ) : (
                paginated.map((req) => {
                  const waClean = String(req.whatsappNumber || "").replace(/\D/g, "");
                  return (
                    <tr key={req.id} className="hover:bg-gray-50/70 dark:hover:bg-emerald-950/30">
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-mono font-bold text-brand-emerald dark:text-brand-gold block">
                          {req.referenceId || req.id.slice(0, 8)}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white text-sm block">
                          {req.fullName}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          {req.ageGroup === "child" ? "Child" : "Adult"}
                          {req.studentAge ? ` (${req.studentAge} yrs)` : ""}
                          {req.parentName ? ` • Parent: ${req.parentName}` : ""}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 space-y-1">
                        <a
                          href={`https://wa.me/${waClean}?text=${encodeURIComponent(
                            `Assalamu Alaikum ${req.fullName}, regarding your Humna Academy free trial request (${req.referenceId || ""}) for ${req.preferredCourse}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{req.whatsappNumber}</span>
                        </a>
                        {req.email && (
                          <a
                            href={`mailto:${req.email}`}
                            className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-brand-emerald"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{req.email}</span>
                          </a>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-gray-900 dark:text-white block">
                          {req.preferredCourse}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          Level: {req.readingLevel} • Teacher: {req.preferredTeacher}
                        </span>
                        {req.assignedTeacherName && (
                          <span className="text-[10px] text-brand-emerald dark:text-brand-gold font-bold block mt-0.5">
                            Assigned: {req.assignedTeacherName}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-medium text-gray-800 dark:text-gray-200 block">
                          {req.country || "Not specified"} ({req.timeZone})
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          {Array.isArray(req.preferredDays) ? req.preferredDays.join(", ") : ""} •{" "}
                          {req.preferredTime}
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {req.createdAt ? new Date(req.createdAt).toLocaleString() : ""}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <select
                          value={req.status}
                          onChange={(e) => handleQuickStatus(req.id, e.target.value as TrialStatus)}
                          className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16] text-xs font-semibold"
                        >
                          {TRIAL_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedReq(req);
                              setEditForm(req);
                            }}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white text-gray-700 dark:text-gray-200"
                            title="View / Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleConvertToStudent(req)}
                            className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-brand-emerald hover:text-white text-brand-emerald"
                            title="Convert to Enrolled Student"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(req)}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-600 hover:text-white text-red-600"
                            title="Delete Request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-emerald-900/60 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Showing {paginated.length} of {filtered.length} requests
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded-lg border border-gray-200 dark:border-emerald-800 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-semibold">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg border border-gray-200 dark:border-emerald-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View / Edit Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <div>
                <span className="text-[11px] font-mono text-brand-emerald dark:text-brand-gold font-bold">
                  {selectedReq.referenceId}
                </span>
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                  Trial Request Details & Assignment
                </h3>
              </div>
              <button onClick={() => setSelectedReq(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName || ""}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Parent / Guardian</label>
                  <input
                    type="text"
                    value={editForm.parentName || ""}
                    onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={editForm.whatsappNumber || ""}
                    onChange={(e) => setEditForm({ ...editForm, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Course</label>
                  <input
                    type="text"
                    value={editForm.preferredCourse || ""}
                    onChange={(e) => setEditForm({ ...editForm, preferredCourse: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Student Age</label>
                  <input
                    type="text"
                    value={editForm.studentAge || ""}
                    onChange={(e) => setEditForm({ ...editForm, studentAge: e.target.value })}
                    placeholder="e.g. 9 years"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Request Status</label>
                  <select
                    value={editForm.status || "New"}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as TrialStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {TRIAL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Assign Teacher</label>
                  <select
                    value={editForm.assignedTeacherId || ""}
                    onChange={(e) => {
                      const t = teachers.find((x) => x.id === e.target.value);
                      setEditForm({
                        ...editForm,
                        assignedTeacherId: e.target.value,
                        assignedTeacherName: t ? t.name : "",
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="">-- Unassigned --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.gender})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedReq.additionalMessage && (
                <div className="p-3 rounded-xl bg-brand-cream/40 dark:bg-[#081d16] border border-brand-border">
                  <span className="font-bold block mb-1">Applicant Message:</span>
                  <p className="text-gray-700 dark:text-gray-300">{selectedReq.additionalMessage}</p>
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">Internal Admin Notes</label>
                <textarea
                  rows={3}
                  value={editForm.internalNotes || ""}
                  onChange={(e) => setEditForm({ ...editForm, internalNotes: e.target.value })}
                  placeholder="Teacher feedback, scheduled trial Zoom link, follow-up notes..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-emerald-900">
                <a
                  href={`https://wa.me/${String(editForm.whatsappNumber || "").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReq(null)}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Trial Request"
        message={`Are you sure you want to permanently delete the trial request from "${deleteTarget?.fullName}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}

export default function AdminTrialRequestsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm">Loading...</div>}>
      <TrialRequestsContent />
    </Suspense>
  );
}
