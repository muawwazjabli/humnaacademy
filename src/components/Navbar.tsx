"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, PhoneCall, Calendar } from "lucide-react";
import { Logo } from "./Logo";
import { useLanguage } from "./LanguageContext";
import { ACADEMY_CONFIG } from "@/lib/constants";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/", labelEn: "Home", labelUr: "ہوم" },
    { href: "/about", labelEn: "About Us", labelUr: "ہمارے بارے میں" },
    { href: "/courses", labelEn: "Courses", labelUr: "کورسز" },
    { href: "/teachers", labelEn: "Our Teachers", labelUr: "اساتذہ کرام" },
    { href: "/pricing", labelEn: "Pricing", labelUr: "فیس اور پیکجز" },
    { href: "/blog", labelEn: "Blog", labelUr: "بلاگ" },
    { href: "/faq", labelEn: "FAQ", labelUr: "عمومی سوالات" },
    { href: "/contact", labelEn: "Contact Us", labelUr: "رابطہ کریں" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-brand-emerald font-semibold bg-brand-cream/60"
                      : "text-gray-700 hover:text-brand-deep hover:bg-gray-50"
                  }`}
                >
                  {t(link.labelEn, link.labelUr)}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs & Language Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              title="Toggle English / Urdu"
              aria-label="Toggle English / Urdu"
            >
              <Globe className="w-3.5 h-3.5 text-brand-emerald" />
              <span>{language === "en" ? "اردو" : "English"}</span>
            </button>

            {/* Quick WhatsApp Contact Link */}
            <a
              href={`https://wa.me/${ACADEMY_CONFIG.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">+92 301 7291844</span>
              <span className="xl:hidden">WhatsApp</span>
            </a>

            {/* Primary CTA */}
            <Link
              href="/book-trial"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-deep to-brand-emerald text-white text-sm font-semibold shadow-md shadow-brand-emerald/20 hover:shadow-lg hover:shadow-brand-emerald/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span>{t("Book Free Trial", "مفت ٹرائل بک کریں")}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 rounded border border-gray-200 text-xs font-medium text-gray-700"
            >
              {language === "en" ? "اردو" : "EN"}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-brand-deep hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <nav className="grid gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    active
                      ? "text-brand-emerald bg-brand-cream font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t(link.labelEn, link.labelUr)}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-gray-100 space-y-2.5">
            <Link
              href="/book-trial"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-deep text-white font-semibold text-center shadow-md hover:bg-brand-emerald transition-colors"
            >
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span>{t("Book Free Trial", "مفت ٹرائل بک کریں")}</span>
            </Link>

            <a
              href={`https://wa.me/${ACADEMY_CONFIG.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm font-medium"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp: +92 301 7291844</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
