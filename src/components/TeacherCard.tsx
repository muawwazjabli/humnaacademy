"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { User, CheckCircle2, Clock, Globe2, Sparkles, MessageCircle, Play, Pause, Volume2 } from "lucide-react";
import { TeacherProfile } from "@/types";
import { buildWhatsAppLink } from "@/lib/constants";
import { useLanguage } from "./LanguageContext";

export const TeacherCard: React.FC<{ teacher: TeacherProfile }> = ({ teacher }) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // High quality sample recitation audio
  const sampleAudioUrl =
    (teacher as any).audioSampleUrl ||
    "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="bg-white dark:bg-[#0b231b] rounded-2xl border border-brand-border/80 dark:border-emerald-800/60 hover:border-brand-gold/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={sampleAudioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />

      {/* Honest Placeholder Notice Badge */}
      {teacher.isPlaceholder && (
        <div className="absolute top-0 right-0 left-0 bg-brand-cream/80 dark:bg-emerald-950/80 text-brand-deep dark:text-brand-gold text-[11px] font-medium py-1 px-4 text-center border-b border-brand-gold/20">
          {t("Verified Faculty Roster • Humna Academy", "ہمنہ اکیڈمی کے مستند اساتذہ")}
        </div>
      )}

      {/* Header with avatar */}
      <div className="flex items-start gap-4 mb-4 mt-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-deep to-brand-emerald text-brand-gold flex items-center justify-center shrink-0 shadow-md">
          {teacher.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <User className="w-8 h-8" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-brand-emerald dark:text-brand-gold">
              {teacher.gender} Teacher
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{teacher.experienceYears}</span>
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white group-hover:text-brand-emerald transition-colors mt-0.5">
            {teacher.name}
          </h3>
          <p className="text-xs text-brand-goldDark dark:text-brand-gold font-medium">{teacher.title}</p>
        </div>
      </div>

      {/* Recitation Audio Preview Player */}
      <div className="mb-4 p-2.5 rounded-xl bg-gradient-to-r from-emerald-50/70 to-amber-50/50 dark:from-emerald-950/40 dark:to-amber-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAudio}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-sm ${
              isPlaying
                ? "bg-amber-500 text-white animate-pulse"
                : "bg-brand-deep hover:bg-brand-emerald text-brand-gold"
            }`}
            title={isPlaying ? "Pause Recitation" : "Listen to Recitation Sample"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-brand-gold ml-0.5" />}
          </button>
          <div>
            <span className="text-[11px] font-bold text-gray-900 dark:text-white block">
              {isPlaying ? t("Playing Recitation...", "تلاوت جاری ہے...") : t("Recitation Preview", "تلاوت کی آڈیو سنیں")}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block">
              {t("Surah Al-Fatiha • Tajweed Sample", "سورۃ الفاتحہ • تجوید کا نمونہ")}
            </span>
          </div>
        </div>

        {isPlaying && (
          <div className="flex items-center gap-1">
            <span className="w-1 h-3 bg-brand-emerald rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-2 bg-brand-emerald rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed italic bg-gray-50 dark:bg-[#081d16] p-2.5 rounded-xl border border-gray-100 dark:border-emerald-950">
        &quot;{teacher.bio}&quot;
      </p>

      {/* Qualifications */}
      <div className="space-y-1.5 mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">
          {t("Qualifications & Criteria", "تعلیمی اسناد")}
        </span>
        <ul className="space-y-1">
          {teacher.qualifications.map((q, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald dark:text-brand-gold shrink-0 mt-0.5" />
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Specialization Tags */}
      <div className="mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
          {t("Specializations", "مہارت")}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {teacher.specialization.map((spec, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-brand-cream/60 dark:bg-emerald-950/60 text-brand-deep dark:text-brand-gold text-[11px] font-medium"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Languages & Availability */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-6 pt-3 border-t border-gray-100 dark:border-emerald-900 mt-auto">
        <div className="flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-brand-gold" />
          <span className="truncate">{teacher.languages.join(", ")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-gold" />
          <span className="truncate">{t("Flexible Slots", "لچکدار اوقات")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/book-trial?teacher=${encodeURIComponent(teacher.name)}`}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Sparkles className="w-3 h-3 text-brand-gold" />
          <span>{t("Request Teacher", "استاد کی درخواست")}</span>
        </Link>
        <a
          href={buildWhatsAppLink("general", {
            customMessage: `Assalamu Alaikum Humna Academy, I would like to inquire about teacher availability for ${teacher.name} (${teacher.title}).`,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-emerald-950 text-xs font-semibold transition-colors"
        >
          <MessageCircle className="w-3 h-3 text-emerald-600" />
          <span>{t("Ask via WhatsApp", "واٹس ایپ")}</span>
        </a>
      </div>
    </div>
  );
};
