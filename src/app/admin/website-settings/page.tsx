"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Save, Loader2, Plus, Trash2, AlertTriangle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminContext";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DEFAULT_WEBSITE_CONTENT, DEFAULT_WEBSITE_SETTINGS } from "@/lib/default-content";
import { Language, WebsiteContentData, WebsiteSettingsData } from "@/types";

export default function AdminWebsiteSettingsPage() {
  const { showToast, can } = useAdmin();
  const [tab, setTab] = useState<"hero" | "about" | "contact" | "general">("hero");
  const [content, setContent] = useState<WebsiteContentData>(DEFAULT_WEBSITE_CONTENT);
  const [settings, setSettings] = useState<WebsiteSettingsData>(DEFAULT_WEBSITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = can("settings");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        fetch("/api/admin/resource/website-content?id=main", { cache: "no-store" }),
        isSuperAdmin
          ? fetch("/api/admin/resource/settings?id=general", { cache: "no-store" })
          : Promise.resolve(null),
      ]);

      if (cRes && cRes.ok) {
        const j = await cRes.json();
        if (j.item) {
          setContent({
            ...DEFAULT_WEBSITE_CONTENT,
            ...j.item,
            hero: { ...DEFAULT_WEBSITE_CONTENT.hero, ...(j.item.hero || {}) },
            announcement: {
              ...DEFAULT_WEBSITE_CONTENT.announcement,
              ...(j.item.announcement || {}),
            },
            about: { ...DEFAULT_WEBSITE_CONTENT.about, ...(j.item.about || {}) },
          });
        }
      }

      if (sRes && sRes.ok) {
        const j = await sRes.json();
        if (j.item) {
          setSettings({
            ...DEFAULT_WEBSITE_SETTINGS,
            ...j.item,
            social: { ...DEFAULT_WEBSITE_SETTINGS.social, ...(j.item.social || {}) },
          });
        }
      }
    } catch {
      showToast("error", "Could not load website content/settings.");
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const contentSave = await fetch("/api/admin/resource/website-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...content, id: "main" }),
      });

      if (!contentSave.ok) throw new Error("Failed to save website content");

      if (isSuperAdmin) {
        const settingsSave = await fetch("/api/admin/resource/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...settings, id: "general" }),
        });
        if (!settingsSave.ok) throw new Error("Failed to save general settings");
      }

      showToast("success", "Website content & settings saved! Changes are live.");
    } catch (err: any) {
      showToast("error", err?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Website Content & Settings"
      subtitle="Dynamically customize homepage hero, slides, about text, contact info, social links, and SEO settings."
      actions={
        <button
          onClick={handleSaveAll}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold shadow-md disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Publishing..." : "Save & Publish Changes"}</span>
        </button>
      }
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-emerald-900 pb-3">
        {[
          { key: "hero", label: "Hero, Slides & Announcement" },
          { key: "about", label: "About, Why Us & Steps" },
          { key: "contact", label: "Contact, Social & Footer" },
          ...(isSuperAdmin ? [{ key: "general", label: "Brand, SEO & System Settings" }] : []),
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              tab === t.key
                ? "bg-brand-deep text-white"
                : "bg-white dark:bg-[#0b231b] border border-gray-200 dark:border-emerald-800 text-gray-700 dark:text-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-emerald" />
          Loading website configuration...
        </div>
      ) : (
        <form onSubmit={handleSaveAll} className="space-y-6 text-xs">
          {/* TAB 1: HERO, SLIDES & ANNOUNCEMENT */}
          {tab === "hero" && (
            <div className="space-y-6">
              {/* Announcement Bar */}
              <div className="bg-white dark:bg-[#0b231b] p-6 rounded-2xl border border-gray-200 dark:border-emerald-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg">Announcement Bar</h3>
                  <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.announcement.enabled}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, enabled: e.target.checked },
                        })
                      }
                    />
                    <span>Show Announcement Bar</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Announcement Text (English)</label>
                    <input
                      type="text"
                      value={content.announcement.textEn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, textEn: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Announcement Text (Urdu)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={content.announcement.textUr}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, textUr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-white dark:bg-[#0b231b] p-6 rounded-2xl border border-gray-200 dark:border-emerald-900/50 space-y-4">
                <h3 className="font-serif font-bold text-lg">Homepage Hero Copy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Main Heading (English)</label>
                    <input
                      type="text"
                      value={content.hero.headingEn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, headingEn: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Main Heading (Urdu)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={content.hero.headingUr}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, headingUr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Subtitle (English)</label>
                    <textarea
                      rows={2}
                      value={content.hero.subtitleEn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, subtitleEn: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Subtitle (Urdu)</label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={content.hero.subtitleUr}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, subtitleUr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Primary CTA Text</label>
                    <input
                      type="text"
                      value={content.hero.ctaTextEn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, ctaTextEn: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Primary CTA Link</label>
                    <input
                      type="text"
                      value={content.hero.ctaLink}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, ctaLink: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>
                </div>
              </div>

              {/* Homepage Banner Slides */}
              <div className="bg-white dark:bg-[#0b231b] p-6 rounded-2xl border border-gray-200 dark:border-emerald-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg">Homepage Banner Slides</h3>
                    <p className="text-[11px] text-gray-500">
                      Manage the widescreen hero carousel images displayed at the top of the homepage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          slides: [
                            ...content.hero.slides,
                            { imageUrl: "", altEn: "Humna Academy Banner", altUr: "حُمنہ اکیڈمی بینر" },
                          ],
                        },
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-deep text-white font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slide</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(content.hero.slides || []).map((slide, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-200 dark:border-emerald-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Slide #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setContent({
                              ...content,
                              hero: {
                                ...content.hero,
                                slides: content.hero.slides.filter((_, i) => i !== idx),
                              },
                            })
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <ImageUploader
                        value={slide.imageUrl}
                        onChange={(url) => {
                          const updated = [...content.hero.slides];
                          updated[idx] = { ...updated[idx], imageUrl: url };
                          setContent({ ...content, hero: { ...content.hero, slides: updated } });
                        }}
                        folder="slides"
                        label="Slide Image"
                      />
                      <input
                        type="text"
                        value={slide.altEn}
                        onChange={(e) => {
                          const updated = [...content.hero.slides];
                          updated[idx] = { ...updated[idx], altEn: e.target.value };
                          setContent({ ...content, hero: { ...content.hero, slides: updated } });
                        }}
                        placeholder="Alt text (English)"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#0b231b]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT, WHY CHOOSE US & HOW IT WORKS */}
          {tab === "about" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#0b231b] p-6 rounded-2xl border border-gray-200 dark:border-emerald-900/50 space-y-4">
                <h3 className="font-serif font-bold text-lg">About Humna Academy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">About Heading (EN)</label>
                    <input
                      type="text"
                      value={content.about.headingEn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, headingEn: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">About Heading (UR)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={content.about.headingUr}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, headingUr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Introduction (EN)</label>
                    <textarea
                      rows={3}
                      value={content.about.introEn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, introEn: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Introduction (UR)</label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={content.about.introUr}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, introUr: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Mission (EN)</label>
                    <textarea
                      rows={2}
                      value={content.about.missionEn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, missionEn: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Vision (EN)</label>
                    <textarea
                      rows={2}
                      value={content.about.visionEn}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, visionEn: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                    />
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-white dark:bg-[#0b231b] p-6 rounded-2xl border border-gray-200 dark:border-emerald-900/50 space-y-4">
                <h3 className="font-serif font-bold text-lg">How It Works (3 Steps)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(content.howItWorks || []).map((step, idx) => (
                    <div
                      key={step.step}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-[#081d16] border border-gray-200 dark:border-emerald-800 space-y-2"
                    >
                      <span className="font-bold text-brand-emerald">Step {step.step}</span>
                      <input
                        type="text"
                        value={step.titleEn}
                        onChange={(e) => {
                          const next = [...content.howItWorks];
                          next[idx] = { ...next[idx], titleEn: e.target.value };
                          setContent({ ...content, howItWorks: next });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#0b231b]"
                      />
                      <textarea
                        rows={2}
                        value={step.descEn}
                        onChange={(e) => {
                          const next = [...content.howItWorks];
                          next[idx] = { ...next[idx], descEn: e.target.value };
                          setContent({ ...content, howItWorks: next });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#0b231b]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT, SOCIAL & FOOTER */}
          {tab === "contact" && (
            <div className="bg-white dark:bg-[#0b231b] p-6 rounded-2xl border border-gray-200 dark:border-emerald-900/50 space-y-5">
              <h3 className="font-serif font-bold text-lg">Contact, Social Media & Footer</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">WhatsApp Raw Number (no +)</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Display Phone Number</label>
                  <input
                    type="text"
                    value={settings.phoneDisplay}
                    onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Contact Email (Optional)</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Business Hours</label>
                  <input
                    type="text"
                    value={settings.businessHours}
                    onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={settings.social.facebook}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social: { ...settings.social, facebook: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={settings.social.youtube}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social: { ...settings.social, youtube: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">TikTok URL</label>
                  <input
                    type="url"
                    value={settings.social.tiktok}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social: { ...settings.social, tiktok: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={settings.social.instagram}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social: { ...settings.social, instagram: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Footer Description (English)</label>
                  <textarea
                    rows={3}
                    value={settings.footerDescriptionEn}
                    onChange={(e) =>
                      setSettings({ ...settings, footerDescriptionEn: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Footer Description (Urdu)</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={settings.footerDescriptionUr}
                    onChange={(e) =>
                      setSettings({ ...settings, footerDescriptionUr: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] font-urdu"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BRAND, SEO & SYSTEM SETTINGS (Super Admin Only) */}
          {tab === "general" && isSuperAdmin && (
            <div className="bg-white dark:bg-[#0b231b] p-6 rounded-2xl border border-gray-200 dark:border-emerald-900/50 space-y-5">
              <h3 className="font-serif font-bold text-lg">Brand, SEO & System Settings</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Academy Name</label>
                  <input
                    type="text"
                    value={settings.academyName}
                    onChange={(e) => setSettings({ ...settings, academyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Website Title</label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Default Language</label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultLanguage: e.target.value as Language })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="en">English (LTR)</option>
                    <option value="ur">Urdu (RTL)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Default Currency</label>
                  <select
                    value={settings.defaultCurrency}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultCurrency: e.target.value as WebsiteSettingsData["defaultCurrency"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="PKR">PKR (Rs.)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  value={settings.logoUrl}
                  onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                  folder="branding"
                  label="Academy Logo"
                />
                <ImageUploader
                  value={settings.faviconUrl}
                  onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                  folder="branding"
                  label="Favicon"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-900 dark:text-red-200">Maintenance Mode</h4>
                    <p className="text-[11px] text-red-700 dark:text-red-300">
                      When enabled, public visitors see a scheduled maintenance notice while administrators continue using the Admin Panel normally.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-5 h-5"
                />
              </div>
            </div>
          )}
        </form>
      )}
    </AdminShell>
  );
}
