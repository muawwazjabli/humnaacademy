"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Trash2, Eye, EyeOff, Edit3, X, Upload, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { GalleryItem } from "@/types";

const GALLERY_CATEGORIES = ["Academy Banners", "Quran Learning", "Student Milestones", "Events", "General"];

const EMPTY_GALLERY: Partial<GalleryItem> = {
  title: "",
  description: "",
  imageUrl: "",
  category: "General",
  displayOrder: 1,
  status: "published",
};

export default function AdminGalleryPage() {
  const { showToast, globalSearch } = useAdmin();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState<Partial<GalleryItem>>(EMPTY_GALLERY);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/resource/gallery", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setItems(j.items || []);
      }
    } catch {
      showToast("error", "Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingBulk(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) continue;
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "gallery");
        const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!upRes.ok) continue;
        const upJson = await upRes.json();
        if (upJson.url) {
          await fetch("/api/admin/resource/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "),
              description: "",
              imageUrl: upJson.url,
              category: "General",
              displayOrder: items.length + i + 1,
              status: "published",
            }),
          });
          successCount++;
        }
      } catch {
        // skip individual failure
      }
    }

    setUploadingBulk(false);
    if (bulkInputRef.current) bulkInputRef.current.value = "";
    if (successCount > 0) {
      showToast("success", `Uploaded ${successCount} image(s) to Gallery.`);
      await loadGallery();
    } else {
      showToast("error", "Bulk upload failed. Ensure Firebase Storage is activated.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      showToast("error", "Image title and file/URL are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/resource/gallery", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Gallery item saved.");
      setModalOpen(false);
      await loadGallery();
    } catch {
      showToast("error", "Failed to save gallery item.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (item: GalleryItem) => {
    const nextStatus = item.status === "published" ? "draft" : "published";
    const res = await fetch("/api/admin/resource/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, status: nextStatus }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((g) => (g.id === item.id ? { ...g, status: nextStatus } : g)));
      showToast("success", `Image ${nextStatus === "published" ? "published" : "hidden"}.`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/resource/gallery?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("success", "Gallery image deleted.");
      setDeleteTarget(null);
      await loadGallery();
    } catch {
      showToast("error", "Failed to delete image.");
    } finally {
      setDeleting(false);
    }
  };

  const q = globalSearch.toLowerCase().trim();
  const filtered = items.filter((g) =>
    q ? `${g.title} ${g.category} ${g.description || ""}`.toLowerCase().includes(q) : true
  );

  return (
    <AdminShell
      title="Gallery CMS"
      subtitle="Upload, organize, categorize, and publish images displayed in the Academy Gallery."
      actions={
        <>
          <input
            ref={bulkInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleBulkUpload}
            className="hidden"
          />
          <button
            onClick={() => bulkInputRef.current?.click()}
            disabled={uploadingBulk}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-gold text-brand-deep dark:text-brand-gold text-xs font-bold"
          >
            {uploadingBulk ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>{uploadingBulk ? "Uploading..." : "Upload Multiple Images"}</span>
          </button>
          <button
            onClick={() => {
              setIsNew(true);
              setForm({ ...EMPTY_GALLERY, displayOrder: items.length + 1 });
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Image</span>
          </button>
        </>
      }
    >
      {loading ? (
        <div className="py-12 text-center text-xs">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
          Loading gallery...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 p-12 text-center text-xs text-gray-500">
          No gallery images uploaded yet. Use &quot;Upload Multiple Images&quot; or &quot;Add Single Image&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>

              <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-100 dark:border-emerald-900/40 pt-3">
                <button
                  onClick={() => togglePublish(item)}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                    item.status === "published"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status === "published" ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{item.status === "published" ? "Live" : "Hidden"}</span>
                </button>
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <h3 className="font-serif text-xl font-bold">
                {isNew ? "Add Gallery Image" : "Edit Gallery Image"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <ImageUploader
                value={form.imageUrl || ""}
                onChange={(url) => setForm({ ...form, imageUrl: url })}
                folder="gallery"
                label="Gallery Image *"
              />

              <div>
                <label className="font-semibold block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={form.category || "General"}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div>
                <label className="font-semibold block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
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
                  {saving ? "Saving..." : "Save Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Gallery Image"
        message={`Are you sure you want to remove "${deleteTarget?.title}" from the gallery?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
