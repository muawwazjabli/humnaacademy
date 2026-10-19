"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, ShieldCheck, ExternalLink, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { ACADEMY_CONFIG } from "@/lib/constants";
import { COURSES } from "@/data/courses";
import { useLanguage } from "./LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-deep text-brand-cream border-t border-brand-gold/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Academy Bio & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <Logo lightMode={true} />
            <p className="text-sm text-brand-cream/80 max-w-sm leading-relaxed mt-4">
              {t(
                "Humna Academy is an online Quran and Islamic education academy offering one-to-one personalized learning in Quran Reading (Nazra), Tajweed, Hifz, Tafseer, and Arabic for children and adults worldwide.",
                "حُمنہ اکیڈمی ایک آن لائن قرآن و اسلامی تعلیمی اکیڈمی ہے جو دنیا بھر میں بچوں اور بڑوں کے لیے ناظرہ قرآن، تجوید، حفظ، تفسیر اور عربی زبان کی ون ٹو ون کلاسز فراہم کرتی ہے۔"
              )}
            </p>

            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-brand-gold font-semibold block mb-3">
                {t("Follow Official Channels", "سرکاری سوشل میڈیا چینلز")}
              </span>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href={ACADEMY_CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-gold hover:text-brand-deep flex items-center justify-center transition-colors text-white"
                  title="Humna Academy on Facebook"
                  aria-label="Humna Academy on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href={ACADEMY_CONFIG.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-gold hover:text-brand-deep flex items-center justify-center transition-colors text-white"
                  title="Humna Academy on YouTube"
                  aria-label="Humna Academy on YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href={ACADEMY_CONFIG.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-gold hover:text-brand-deep flex items-center justify-center transition-colors text-white"
                  title="Humna Academy on TikTok"
                  aria-label="Humna Academy on TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href={ACADEMY_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-gold hover:text-brand-deep flex items-center justify-center transition-colors text-white"
                  title="Humna Academy on Instagram"
                  aria-label="Humna Academy on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold mb-4">
              {t("Explore", "رہنمائی")}
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-cream/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t("Home", "ہوم")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t("About Humna Academy", "اکیڈمی کا تعارف")}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  {t("All Courses", "تمام کورسز")}
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="hover:text-white transition-colors">
                  {t("Our Teachers", "اساتذہ کرام")}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {t("Pricing & Packages", "فیس و پیکجز")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  {t("Blog & Islamic Guides", "بلاگ و رہنمائی")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  {t("Frequently Asked Questions", "اکثر پوچھے گئے سوالات")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Courses */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold mb-4">
              {t("Popular Courses", "نمایاں کورسز")}
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-cream/80">
              {COURSES.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link href={`/courses/${c.slug}`} className="hover:text-white transition-colors truncate block">
                    {t(c.title, c.titleUrdu)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/courses" className="text-brand-gold hover:underline font-medium text-xs inline-flex items-center gap-1 mt-1">
                  <span>{t("View All 13 Courses →", "تمام 13 کورسز دیکھیں ←")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Portals */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold mb-4">
              {t("Contact & Portals", "رابطہ اور پورٹلز")}
            </h4>
            <div className="space-y-3 text-sm text-brand-cream/80">
              <a
                href={`https://wa.me/${ACADEMY_CONFIG.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-cream hover:text-white group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>+92 301 7291844</span>
              </a>

              <p className="text-xs text-brand-cream/70">
                {t(
                  "Available on WhatsApp for inquiries, trial scheduling & student coordination.",
                  "واٹس ایپ پر رابطہ اور کلاس شیڈولنگ کے لیے ہمہ وقت دستیاب۔"
                )}
              </p>

              <div className="pt-3 border-t border-white/10 space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-brand-gold font-semibold block">
                  {t("Student & Staff Portals", "طلباء اور اساتذہ پورٹل")}
                </span>
                <Link
                  href="/portal/student"
                  className="text-xs text-brand-cream/90 hover:text-white flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{t("Student Portal", "طالب علم پورٹل")}</span>
                </Link>
                <Link
                  href="/portal/admin"
                  className="text-xs text-brand-cream/90 hover:text-white flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{t("Academy Admin Portal", "ایڈمن پورٹل")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-cream/70">
          <div>
            © {new Date().getFullYear()} {ACADEMY_CONFIG.name}. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              {t("Privacy Policy", "پرائیویسی پالیسی")}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t("Terms & Conditions", "شرائط و ضوابط")}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              {t("Contact Us", "رابطہ")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
