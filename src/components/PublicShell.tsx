"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFloatingButton } from "./WhatsAppFloatingButton";
import { usePublicData } from "./PublicDataContext";
import { ShieldAlert, MessageCircle } from "lucide-react";

export const PublicShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const { settings } = usePublicData();

  if (isAdminRoute) {
    return <>{children}</>;
  }

  if (settings?.maintenanceMode) {
    return (
      <div className="min-h-screen bg-[#123F32] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">
          {settings.academyName || "Humna Academy"} — Scheduled Maintenance
        </h1>
        <p className="text-brand-cream/80 max-w-md text-sm leading-relaxed">
          We are currently updating our website to serve you better. Classes and WhatsApp support continue normally.
        </p>
        <a
          href={`https://wa.me/${settings.whatsappNumber || "923017291844"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold shadow-lg hover:bg-[#20ba59] transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Contact Us on WhatsApp ({settings.phoneDisplay || "+92 301 7291844"})</span>
        </a>
      </div>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
};
