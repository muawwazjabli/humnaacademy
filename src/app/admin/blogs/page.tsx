"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, ExternalLink, X, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { BlogPost } from "@/types";

const BLOG_CATEGORIES = [
  "Quran Learning",
  "Tajweed",
  "Islamic Education",
  "Parenting",
  "Hifz Tips",
  "Islamic Knowledge",
  "Beginner Guide",
];

const EMPTY_BLOG: Partial<BlogPost> = {
  title: "",
  urduTitle: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "Quran Learning",
  author: { name: "Humna Academy Editorial", role: "Quranic Curriculum Team" },
  publishedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  readTime: "5 min read",
  draftNotice: "Educational article published by Humna Academy.",
  tags: [],
  metaTitle: "",
  metaDescription: "",
  status: "published",
};

export default function AdminBlogsPage() {
  const { showToast, globalSearch, admin } = useAdmin();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [form, setForm] = useState<Partial<BlogPost>>(EMPTY_BLOG);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/resource/blogs", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setBlogs(j.items || []);
      }
    } catch {
      showToast("error", "Could not load blog articles.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleSave = async (e: React.FormEvent, overrideStatus?: "published" | "draft") => {
    e.preventDefault();
    if (!form.title || !form.content) {
      showToast("error", "Blog title and article content are required.");
      return;
    }

    const computedSlug =
      form.slug?.trim() ||
      form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    setSaving(true);
    try {
      const payload = {
        ...form,
        id: form.id || computedSlug,
        slug: computedSlug,
        status: overrideStatus || form.status || "published",
      };

      const res = await fetch("/api/admin/resource/blogs", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", `Article "${form.title}" saved.`);
      setModalOpen(false);
      await loadBlogs();
    } catch {
      showToast("error", "Failed to save blog article.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    const nextStatus = post.status === "draft" ? "published" : "draft";
    const id = post.id || post.slug;
    const res = await fetch("/api/admin/resource/blogs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    if (res.ok) {
      setBlogs((prev) =>
        prev.map((b) => ((b.id || b.slug) === id ? { ...b, status: nextStatus } : b))
      );
      showToast("success", `Article ${nextStatus === "published" ? "published" : "moved to draft"}.`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const id = deleteTarget.id || deleteTarget.slug;
      const res = await fetch(`/api/admin/resource/blogs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      showToast("success", "Blog post deleted.");
      setDeleteTarget(null);
      await loadBlogs();
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete blog post.");
    } finally {
      setDeleting(false);
    }
  };

  const q = (search || globalSearch).toLowerCase().trim();
  const filtered = blogs.filter((b) =>
    q ? `${b.title} ${b.urduTitle || ""} ${b.category} ${b.excerpt}`.toLowerCase().includes(q) : true
  );

  return (
    <AdminShell
      title="Blog CMS"
      subtitle="Write, edit, and publish bilingual Quran & Islamic education articles with SEO metadata."
      actions={
        <button
          onClick={() => {
            setIsNew(true);
            setForm(EMPTY_BLOG);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>New Blog Article</span>
        </button>
      }
    >
      <div className="bg-white dark:bg-[#0b231b] p-4 rounded-2xl border border-gray-200 dark:border-emerald-900/50">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, category, or keyword..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-xs"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-gray-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#081d16] border-b border-gray-200 dark:border-emerald-900/60 uppercase text-[10px] text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3.5 font-bold">Article Title</th>
                <th className="px-4 py-3.5 font-bold">Category</th>
                <th className="px-4 py-3.5 font-bold">Published</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
                    Loading articles...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No blog articles in Firestore yet.
                  </td>
                </tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id || post.slug} className="hover:bg-gray-50/70 dark:hover:bg-emerald-950/30">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {post.featuredImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-12 h-9 rounded-lg object-cover border shrink-0"
                          />
                        )}
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">
                            {post.title}
                          </span>
                          {post.urduTitle && (
                            <span className="font-urdu text-[11px] text-brand-emerald dark:text-brand-gold block">
                              {post.urduTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{post.category}</td>
                    <td className="px-4 py-3.5 text-gray-500">{post.publishedAt}</td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => togglePublish(post)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          post.status !== "draft"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {post.status !== "draft" ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        <span>{post.status !== "draft" ? "Published" : "Draft"}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-emerald hover:text-white"
                          title="View Post"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            setIsNew(false);
                            setForm(post);
                            setModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-950 hover:bg-brand-deep hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {admin?.role !== "editor" && (
                          <button
                            onClick={() => setDeleteTarget(post)}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-600 hover:text-white text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Blog Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
              <h3 className="font-serif text-xl font-bold">
                {isNew ? "Create New Blog Post" : `Edit Post: ${form.title}`}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleSave(e)} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Blog Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Urdu Title (Optional)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.urduTitle || ""}
                    onChange={(e) => setForm({ ...form, urduTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug || ""}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={form.category || "Quran Learning"}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    {BLOG_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={form.author?.name || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        author: { name: e.target.value, role: form.author?.role || "Editorial" },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={(form.tags || []).join(", ")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
              </div>

              <ImageUploader
                value={form.featuredImage || ""}
                onChange={(url) => setForm({ ...form, featuredImage: url })}
                folder="blogs"
                label="Featured Article Image"
              />

              <div>
                <label className="font-semibold block mb-1">Short Description / Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt || ""}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Full Article Content *</label>
                <RichTextEditor
                  value={form.content || ""}
                  onChange={(val) => setForm({ ...form, content: val })}
                />
              </div>

              {/* SEO Settings */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-200 dark:border-emerald-900/50 space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-brand-emerald dark:text-brand-gold block">
                  SEO Settings
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={form.metaTitle || ""}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#0b231b]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Meta Description</label>
                    <input
                      type="text"
                      value={form.metaDescription || ""}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#0b231b]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-emerald-900">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSave(e, "draft")}
                  className="px-4 py-2 rounded-xl border border-brand-gold text-brand-deep dark:text-brand-gold font-bold"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  onClick={() => setForm({ ...form, status: "published" })}
                  className="px-5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white font-bold"
                >
                  {saving ? "Saving..." : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Blog Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
