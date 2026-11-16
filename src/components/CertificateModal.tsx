"use client";

import React, { useRef } from "react";
import { Award, Printer, X, Download, ShieldCheck, Sparkles } from "lucide-react";

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  courseName: string;
  completionDate?: string;
  certificateId?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  open,
  onClose,
  studentName,
  courseName,
  completionDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  certificateId = `HA-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#081d16] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 dark:border-emerald-800">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-gold" />
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
              Official Humna Academy Certificate
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div
          ref={printRef}
          className="relative bg-gradient-to-b from-[#fbf8f1] to-[#f4eedb] text-gray-900 p-8 sm:p-14 rounded-2xl border-8 border-double border-brand-gold/60 shadow-inner space-y-8 text-center"
        >
          {/* Corner Decors */}
          <div className="absolute top-3 left-3 text-brand-gold/40 text-xs font-serif">◈ ◈ ◈</div>
          <div className="absolute top-3 right-3 text-brand-gold/40 text-xs font-serif">◈ ◈ ◈</div>
          <div className="absolute bottom-3 left-3 text-brand-gold/40 text-xs font-serif">◈ ◈ ◈</div>
          <div className="absolute bottom-3 right-3 text-brand-gold/40 text-xs font-serif">◈ ◈ ◈</div>

          {/* Top Logo & Bismillah */}
          <div className="space-y-2">
            <p className="font-arabic text-xl sm:text-2xl text-emerald-900 font-bold" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-brand-goldDark uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HUMNA ONLINE QURAN ACADEMY</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-brand-deep tracking-wide uppercase">
              Certificate of Completion
            </h1>
            <p className="font-arabic text-sm text-emerald-800" dir="rtl">
              شَهَادَةُ إِتْمَامِ الدِّرَاسَةِ القُرْآنِيَّةِ
            </p>
          </div>

          {/* Main Body */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              This is to certify that
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 border-b-2 border-brand-gold/50 pb-2 inline-block px-8">
              {studentName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pt-2">
              has successfully completed all curricular requirements, Tajweed rules, and oral assessments for the course:
            </p>
            <p className="font-serif text-xl sm:text-2xl font-bold text-brand-deep">
              {courseName}
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-brand-gold/30 max-w-2xl mx-auto">
            <div className="text-center sm:text-left space-y-1">
              <div className="font-script text-xl text-brand-deep italic">Qari M. Rizwan</div>
              <div className="w-36 h-0.5 bg-gray-400"></div>
              <p className="text-[11px] text-gray-600 font-bold">Academic Director</p>
            </div>

            <div className="w-20 h-20 rounded-full border-4 border-dashed border-brand-gold flex flex-col items-center justify-center p-2 text-center bg-white/50 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-brand-deep">VERIFIED</span>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="font-script text-xl text-brand-deep italic">Qari A. Rehman</div>
              <div className="w-36 h-0.5 bg-gray-400"></div>
              <p className="text-[11px] text-gray-600 font-bold">Head of Tajweed Faculty</p>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 pt-4 border-t border-gray-200/60">
            <span>Issue Date: {completionDate}</span>
            <span>Certificate ID: {certificateId}</span>
            <span>Verify at: https://humnaacademy.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};
