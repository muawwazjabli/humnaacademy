import React from "react";
import Link from "next/link";
import Image from "next/image";

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
  const dimension = size === "sm" ? 38 : size === "lg" ? 56 : 46;

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Official Academy Logo Image */}
      <div className="relative overflow-hidden rounded-xl ring-2 ring-brand-gold/40 group-hover:ring-brand-gold shadow-md transition-all shrink-0 bg-white flex items-center justify-center">
        <Image
          src="/logo.jpg"
          alt="Humna Academy Logo"
          width={dimension}
          height={dimension}
          className="object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
          style={{ width: dimension, height: dimension }}
          priority
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
      )}
    </Link>
  );
};
