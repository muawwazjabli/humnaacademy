"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, PhoneCall, Calendar, ChevronDown, Sparkles, BookOpen, Users, DollarSign, LogIn } from "lucide-react";
import { Logo } from "./Logo";
import { useLanguage } from "./LanguageContext";
import { ACADEMY_CONFIG } from "@/lib/constants";
import { NightVisionToggle } from "./NightVisionToggle";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Primary navigation links visible on desktop
  const primaryLinks = [
    { href: "/", labelEn: "Home", labelUr: "ہوم" },
    { href: "/courses", labelEn: "Courses", labelUr: "کورسز" },
    { href: "/teachers", labelEn: "Teachers", labelUr: "اساتذہ" },
    { href: "/pricing", labelEn: "Pricing", labelUr: "فیس" },
  ];

  // Secondary items in the "More" dropdown
  const moreLinks = [
    { href: "/about", labelEn: "About Us", labelUr: "ہمارے بارے میں", descEn: "Academy vision, philosophy & faculty" },
    { href: "/blog", labelEn: "Blog & Articles", labelUr: "بلاگ و مضامین", descEn: "Quran learning tips, Tajweed guides" },
    { href: "/faq", labelEn: "FAQ", labelUr: "عمومی سوالات", descEn: "Common queries answered" },
    { href: "/contact", labelEn: "Contact Us", labelUr: "رابطہ کریں", descEn: "Direct reach & academic coordinators" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const isMoreActive = moreLinks.some((l) => isActive(l.href));

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#071912]/95 backdrop-blur-md border-b border-brand-border/60 dark:border-emerald-900/50 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {primaryLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "text-brand-emerald dark:text-brand-gold bg-brand-cream/60 dark:bg-emerald-950/60 shadow-xs"
                      : "text-gray-700 dark:text-gray-200 hover:text-brand-deep dark:hover:text-white hover:bg-gray-50 dark:hover:bg-emerald-950/40"
                  }`}
                >
                  {t(link.labelEn, link.labelUr)}
                </Link>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isMoreActive || moreDropdownOpen
                    ? "text-brand-emerald dark:text-brand-gold bg-brand-cream/60 dark:bg-emerald-950/60"
                    : "text-gray-700 dark:text-gray-200 hover:text-brand-deep dark:hover:text-white hover:bg-gray-50 dark:hover:bg-emerald-950/40"
                }`}
              >
                <span>{t("More", "مزید")}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#091E16] border border-gray-200 dark:border-emerald-900/60 shadow-xl p-2 space-y-1 animate-fadeIn z-50">
                  {moreLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreDropdownOpen(false)}
                      className="block p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                    >
                      <span className="font-bold text-xs text-gray-900 dark:text-white block">
                        {t(item.labelEn, item.labelUr)}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 block line-clamp-1">
                        {item.descEn}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Portal Hub Link */}
            <Link
              href="/portal"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isActive("/portal")
                  ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800"
                  : "bg-gray-50 dark:bg-emerald-950/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-emerald-800/50 hover:border-brand-gold/60"
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-brand-emerald dark:text-brand-gold" />
              <span>{t("Portal", "پورٹل")}</span>
            </Link>
          </nav>

          {/* Action CTAs, Night Vision, & Language Switcher */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Night Vision Toggle */}
            <NightVisionToggle />

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-emerald-800/60 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-emerald-900/40 transition-colors"
              title="Toggle English / Urdu"
              aria-label="Toggle English / Urdu"
            >
              <Globe className="w-3.5 h-3.5 text-brand-emerald dark:text-brand-gold" />
              <span>{language === "en" ? "اردو" : "English"}</span>
            </button>

            {/* Quick WhatsApp Contact Link (Hidden on smaller screens, visible on XL) */}
            <a
              href={`https://wa.me/${ACADEMY_CONFIG.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl border border-emerald-200 dark:border-emerald-800/60 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>+92 301 7291844</span>
            </a>

            {/* Primary CTA */}
            <Link
              href="/book-trial"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-deep to-brand-emerald dark:from-brand-emerald dark:to-brand-deep text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-emerald/20 hover:shadow-lg hover:shadow-brand-emerald/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Calendar className="w-4 h-4 text-brand-gold animate-pulse" />
              <span>{t("Book Free Trial", "مفت ٹرائل لیں")}</span>
            </Link>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex lg:hidden items-center gap-1.5">
            {/* Night Vision Compact Toggle */}
            <NightVisionToggle compact={true} />

            <button
              onClick={toggleLanguage}
              className="px-2 py-1 rounded-lg border border-gray-200 dark:border-emerald-800/60 text-xs font-semibold text-gray-700 dark:text-gray-200"
            >
              {language === "en" ? "اردو" : "EN"}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:text-brand-deep dark:hover:text-white hover:bg-gray-100 dark:hover:bg-emerald-900/40 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-emerald-900/60 bg-white dark:bg-[#091E16] px-4 pt-4 pb-8 space-y-4 shadow-2xl animate-fadeIn">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-3 mb-1">
              {t("Academics", "تعلیمی شعبہ")}
            </span>
            <nav className="grid gap-1">
              {[...primaryLinks, { href: "/portal", labelEn: "Student & Teacher Portal", labelUr: "پورٹل لاگ ان" }].map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                      active
                        ? "text-brand-emerald dark:text-brand-gold bg-brand-cream/80 dark:bg-emerald-950/80"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-emerald-900/40"
                    }`}
                  >
                    <span>{t(link.labelEn, link.labelUr)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-3 mb-1">
              {t("About & Support", "معلومات و رہنمائی")}
            </span>
            <nav className="grid gap-1">
              {moreLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      active
                        ? "text-brand-emerald dark:text-brand-gold bg-brand-cream dark:bg-emerald-950/60 font-semibold"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-900/40"
                    }`}
                  >
                    {t(link.labelEn, link.labelUr)}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-emerald-900/50 space-y-2">
            <Link
              href="/book-trial"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-deep to-brand-emerald text-white font-bold text-sm text-center shadow-md active:scale-95 transition-all"
            >
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span>{t("Book Free Trial Class", "مفت جائزہ کلاس لیں")}</span>
            </Link>

            <a
              href={`https://wa.me/${ACADEMY_CONFIG.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp: +92 301 7291844</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
