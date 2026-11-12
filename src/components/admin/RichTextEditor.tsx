"use client";

import React, { useState, useRef } from "react";
import { Bold, Italic, Heading2, Heading3, List, Link2, Image as ImageIcon, Eye, Edit3 } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your article content here...",
}) => {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix = "", defaultText = "text") => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || defaultText;
    const updated = value.slice(0, start) + prefix + selected + suffix + value.slice(end);

    onChange(updated);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-emerald-800 overflow-hidden bg-white dark:bg-[#081d16]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-gray-50 dark:bg-[#0b231b] border-b border-gray-200 dark:border-emerald-800">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormatting("\n\n### ", "\n\n", "Section Heading")}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-emerald-900/60 text-gray-700 dark:text-gray-200"
            title="Heading"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n\n#### ", "\n\n", "Subheading")}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-emerald-900/60 text-gray-700 dark:text-gray-200"
            title="Subheading"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("**", "**", "bold text")}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-emerald-900/60 text-gray-700 dark:text-gray-200"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*", "italic text")}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-emerald-900/60 text-gray-700 dark:text-gray-200"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n- ", "\n- List item 2\n", "List item 1")}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-emerald-900/60 text-gray-700 dark:text-gray-200"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("[", "](https://humnaacademy.com)", "Link Text")}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-emerald-900/60 text-gray-700 dark:text-gray-200"
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n![Image Description](", ")\n", "https://...")}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-emerald-900/60 text-gray-700 dark:text-gray-200"
            title="Insert Image URL"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#081d16] border border-gray-200 dark:border-emerald-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100"
        >
          {preview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{preview ? "Edit" : "Preview"}</span>
        </button>
      </div>

      {preview ? (
        <div className="p-5 min-h-[260px] max-h-[420px] overflow-y-auto space-y-4 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          {value.split("\n\n").map((block, idx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={idx} className="font-serif font-bold text-xl text-gray-900 dark:text-white">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }
            if (trimmed.startsWith("#### ")) {
              return (
                <h4 key={idx} className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                  {trimmed.replace("#### ", "")}
                </h4>
              );
            }
            if (trimmed.startsWith("- ")) {
              return (
                <ul key={idx} className="list-disc pl-5 space-y-1">
                  {trimmed.split("\n").map((li, i) => (
                    <li key={i}>{li.replace(/^- /, "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={idx}>{trimmed}</p>;
          })}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          rows={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none resize-y font-sans leading-relaxed"
        />
      )}
    </div>
  );
};
