"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";

interface NightVisionToggleProps {
  compact?: boolean;
  className?: string;
}

export const NightVisionToggle: React.FC<NightVisionToggleProps> = ({
  compact = false,
  className = "",
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-gray-200 dark:border-emerald-800/60 bg-transparent ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center group ${
          isDark
            ? "border-brand-gold/50 bg-brand-deep/80 text-brand-gold shadow-[0_0_12px_rgba(197,161,90,0.25)] hover:border-brand-gold"
            : "border-gray-200 bg-white text-gray-700 hover:bg-brand-cream/60 hover:text-brand-deep"
        } ${className}`}
        title={isDark ? t("Switch to Day Mode", "ڈے موڈ لگائیں") : t("Activate Night Vision", "نائٹ ویژن لگائیں")}
        aria-label={isDark ? "Switch to Day Mode" : "Activate Night Vision"}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-brand-gold animate-spin-slow transition-transform" />
        ) : (
          <Moon className="w-4 h-4 text-emerald-800 group-hover:text-brand-deep transition-transform" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 group ${
        isDark
          ? "border-brand-gold/60 bg-gradient-to-r from-brand-deep/90 to-[#0e2a22] text-brand-gold shadow-[0_0_15px_rgba(197,161,90,0.2)] hover:border-brand-gold hover:shadow-[0_0_20px_rgba(197,161,90,0.35)]"
          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-brand-cream/50 hover:text-brand-deep"
      } ${className}`}
      title={isDark ? t("Switch to Day Mode", "ڈے موڈ لگائیں") : t("Activate Night Vision", "نائٹ ویژن لگائیں")}
      aria-label="Toggle Night Vision Mode"
    >
      <div className="relative">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-brand-gold" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-brand-emerald group-hover:scale-110 transition-transform" />
        )}
      </div>
      <span className="font-medium whitespace-nowrap">
        {isDark
          ? t("Day Mode", "ڈے موڈ")
          : t("Night Vision", "نائٹ ویژن")}
      </span>
      {isDark && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
      )}
    </button>
  );
};
