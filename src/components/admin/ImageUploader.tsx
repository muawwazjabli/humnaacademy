"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Link2 } from "lucide-react";
import { useAdmin } from "./AdminContext";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  hint?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  folder,
  label = "Image",
  hint = "JPG, PNG, WebP or SVG up to 5MB",
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useAdmin();

  const compressImageIfNeeded = async (file: File): Promise<File> => {
    if (file.type === "image/svg+xml" || file.size <= 800 * 1024) {
      return file;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const maxDim = 1600;
      let { width, height } = bitmap;
      if (width > maxDim || height > maxDim) {
        const scale = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(bitmap, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.85)
      );
      if (!blob) return file;
      return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
    } catch {
      return file;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    if (!["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"].includes(rawFile.type)) {
      showToast("error", "Invalid image format. Please choose JPG, PNG, WebP, or SVG.");
      return;
    }

    if (rawFile.size > 5 * 1024 * 1024) {
      showToast("error", "Image size exceeds 5MB limit.");
      return;
    }

    setUploading(true);
    setProgress(25);

    try {
      const optimizedFile = await compressImageIfNeeded(rawFile);
      setProgress(55);

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(90);
      const json = await res.json();

      if (!res.ok || !json.url) {
        throw new Error(json.error || "Upload failed");
      }

      onChange(json.url);
      setProgress(100);
      showToast("success", "Image uploaded to Firebase Storage.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-medium text-brand-emerald dark:text-brand-gold hover:underline inline-flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? "Hide URL Input" : "Paste Image URL"}</span>
        </button>
      </div>

      {showUrlInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or /logo.jpg"
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-2xl border border-dashed border-gray-300 dark:border-emerald-800 bg-gray-50/70 dark:bg-[#081d16]">
        {value ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-emerald-800 bg-white shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-emerald-950/60 border border-gray-200 dark:border-emerald-900 flex items-center justify-center text-gray-400 shrink-0">
            <ImageIcon className="w-7 h-7" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-semibold transition-colors disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>{uploading ? `Uploading ${progress}%...` : value ? "Replace Image" : "Upload Image"}</span>
            </button>
          </div>

          {uploading && (
            <div className="w-full h-1.5 bg-gray-200 dark:bg-emerald-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-emerald transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <p className="text-[11px] text-gray-500 dark:text-gray-400">{hint}</p>
        </div>
      </div>
    </div>
  );
};
