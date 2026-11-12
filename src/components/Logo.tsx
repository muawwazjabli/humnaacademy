"use client";

import React from "react";
import Link from "next/link";
import { usePublicData } from "./PublicDataContext";

interface LogoProps {
  lightMode?: boolean;
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  lightMode = false,
  className = "",
  showText = true,
  size = "md",
}) => {
  const { settings } = usePublicData();
  const dimension = size === "sm" ? 38 : size === "lg" ? 56 : 46;
  const logoSrc = settings?.logoUrl || "/logo.jpg";
  const academyName = settings?.academyName || "Humna Academy";
  const parts = academyName.split(" ");
  const firstWord = parts[0] || "Humna";
  const restWords = parts.slice(1).join(" ") || "Academy";

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Official Academy Logo Image */}
      <div
        className="relative overflow-hidden rounded-xl ring-2 ring-brand-gold/40 group-hover:ring-brand-gold shadow-md transition-all shrink-0 bg-white flex items-center justify-center"
        style={{ width: dimension, height: dimension }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt={`${academyName} Logo`}
          className="object-cover rounded-xl w-full h-full transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif tracking-tight font-bold text-xl leading-none transition-colors ${
                lightMode
                  ? "text-white"
                  : "text-brand-deep group-hover:text-brand-emerald dark:text-white"
              }`}
            >
              {firstWord}
            </span>
            <span className="font-sans font-semibold text-xl leading-none text-brand-gold">
              {restWords}
            </span>
          </div>
          <span
            className={`text-[10px] tracking-widest uppercase font-medium mt-1 ${
              lightMode ? "text-brand-cream/80" : "text-gray-500 dark:text-gray-300"
            }`}
          >
            {settings?.tagline || "Online Quran Academy"}
          </span>
        </div>
      )}
    </Link>
  );
};
