import React from "react";
import Link from "next/link";

interface LogoProps {
  lightMode?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ lightMode = false, className = "" }) => {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Emblem SVG */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-deep to-brand-emerald p-2 flex items-center justify-center shadow-md border border-brand-gold/30 group-hover:border-brand-gold transition-colors">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-brand-gold"
        >
          {/* Open Quran Book & Radiant Arc */}
          <path
            d="M20 12C16 9 8 9 5 12V31C8 28 16 28 20 31C24 28 32 28 35 31V12C32 9 24 9 20 12Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 12V31"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Subtle Crescent star / divine light */}
          <circle cx="20" cy="6.5" r="2" fill="currentColor" />
          <path
            d="M20 2V4M16 4.5L17.5 5.5M24 4.5L22.5 5.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif tracking-tight font-bold text-xl leading-none transition-colors ${
              lightMode ? "text-white" : "text-brand-deep group-hover:text-brand-emerald dark:text-white"
            }`}
          >
            Humna
          </span>
          <span className="font-sans font-semibold text-xl leading-none text-brand-gold">
            Academy
          </span>
        </div>
        <span
          className={`text-[10px] tracking-widest uppercase font-medium mt-1 ${
            lightMode ? "text-brand-cream/80" : "text-gray-500 dark:text-gray-300"
          }`}
        >
          Online Quran Academy
        </span>
      </div>
    </Link>
  );
};
