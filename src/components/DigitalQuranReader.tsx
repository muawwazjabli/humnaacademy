"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, Volume2, Maximize2, Minimize2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

const QAIDA_LESSONS = [
  { id: 1, titleEn: "Lesson 1: Individual Letters (Huroof Mufradat)", titleUr: "سبق نمبر ۱: حروفِ مفردات", letters: ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "و", "هـ", "ء", "ي"] },
  { id: 2, titleEn: "Lesson 2: Compound Letters (Murakkabat)", titleUr: "سبق نمبر ۲: حروفِ مرکبات", letters: ["لا", "با", "بل", "تم", "ثب", "نت", "يب", "حم", "خج", "عل", "فم", "قو", "كل", "لح", "مس", "نر"] },
  { id: 3, titleEn: "Lesson 3: Disjointed Letters (Muqatta'at)", titleUr: "سبق نمبر ۳: حروفِ مقطعات", letters: ["الۤمۤ", "الۤمۤصۤ", "الۤرٰ", "الۤمۤرٰ", "كٰهٰيٰعۤصۤ", "طٰهٰ", "طٰسۤمۤ", "طٰسۤ", "يٰسۤ", "صۤ", "حٰمۤ", "حٰمۤ عۤسۤقۤ", "قۤ", "نۤ"] },
  { id: 4, titleEn: "Lesson 4: Movements (Harkat: Zabar, Zer, Pesh)", titleUr: "سبق نمبر ۴: حرکات (زبر، زیر، پیش)", letters: ["أَ", "إِ", "أُ", "بَ", "بِ", "بُ", "تَ", "تِ", "تُ", "ثَ", "ثِ", "ثُ", "جَ", "جِ", "جُ", "دَ", "دِ", "دُ"] },
  { id: 5, titleEn: "Lesson 5: Double Movements (Tanween: Do Zabar, Do Zer, Do Pesh)", titleUr: "سبق نمبر ۵: تنوین (دو زبر، دو زیر، دو پیش)", letters: ["بً", "بٍ", "بٌ", "تً", "تٍ", "تٌ", "ثً", "ثٍ", "ثٌ", "جً", "جٍ", "جٌ", "دً", "دٍ", "دٌ", "رً", "رٍ", "رٌ"] },
  { id: 6, titleEn: "Lesson 6: Letters of Maddah (Alif, Waw, Yaa)", titleUr: "سبق نمبر ۶: حروفِ مدہ (الف، واؤ، یاء)", letters: ["بَا", "بُو", "بِي", "تَا", "تُو", "تِي", "ثَا", "ثُو", "ثِي", "جَا", "جُو", "جِي", "حَا", "حُو", "حِي"] },
  { id: 7, titleEn: "Lesson 7: Sukoon (Jazm)", titleUr: "سبق نمبر ۷: سکون یعنی جزم", letters: ["أَبْ", "إِبْ", "أُبْ", "أَتْ", "إِتْ", "أُتْ", "أَثْ", "إِثْ", "أُثْ", "أَجْ", "إِجْ", "أُجْ", "قُلْ", "كُنْ", "هَلْ"] },
  { id: 8, titleEn: "Lesson 8: Tashdeed (Shaddah)", titleUr: "سبق نمبر ۸: تشدید", letters: ["أَبَّ", "إِبَّ", "أُبَّ", "أَتَّ", "إِتَّ", "أُتَّ", "رَبِّ", "ثُمَّ", "إِنَّ", "عَمَّ", "كَلَّا", "حَقٌّ"] },
];

const SURAHS = [
  {
    number: 1,
    name: "Al-Fatihah",
    nameArabic: "الفاتحة",
    ayahs: [
      { num: 1, ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", ur: "اللہ کے نام سے شروع جو نہایت مہربان ہمیشہ رحم فرمانے والا ہے" },
      { num: 2, ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", ur: "سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کی پرورش فرمانے والا ہے" },
      { num: 3, ar: "الرَّحْمَٰنِ الرَّحِيمِ", ur: "نہایت مہربان بہت رحم فرمانے والا ہے" },
      { num: 4, ar: "مَالِكِ يَوْمِ الدِّينِ", ur: "روزِ جزا کا مالک ہے" },
      { num: 5, ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", ur: "ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد چاہتے ہیں" },
      { num: 6, ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", ur: "ہمیں سیدھے راستے پر چلا" },
      { num: 7, ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", ur: "ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ ان کا راستہ جن پر غضب کیا گیا اور نہ گمراہوں کا" },
    ],
  },
  {
    number: 112,
    name: "Al-Ikhlas",
    nameArabic: "الإخلاص",
    ayahs: [
      { num: 1, ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", ur: "فرما دیجیے: وہ اللہ ایک ہے" },
      { num: 2, ar: "اللَّهُ الصَّمَدُ", ur: "اللہ بے نیاز ہے" },
      { num: 3, ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ", ur: "نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے" },
      { num: 4, ar: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", ur: "اور نہ کوئی اس کا ہمسر ہے" },
    ],
  },
  {
    number: 113,
    name: "Al-Falaq",
    nameArabic: "الفلق",
    ayahs: [
      { num: 1, ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", ur: "آپ فرمائیے: میں صبح کے رب کی پناہ مانگتا ہوں" },
      { num: 2, ar: "مِن شَرِّ مَا خَلَقَ", ur: "ہر اس چیز کے شر سے جو اس نے پیدا فرمائی" },
      { num: 3, ar: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", ur: "اور تاریک رات کے شر سے جب وہ چھا جائے" },
      { num: 4, ar: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", ur: "اور گرہوں میں پھونکنے والیوں کے شر سے" },
      { num: 5, ar: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", ur: "اور حسد کرنے والے کے شر سے جب وہ حسد کرے" },
    ],
  },
  {
    number: 114,
    name: "An-Nas",
    nameArabic: "الناس",
    ayahs: [
      { num: 1, ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", ur: "آپ فرمائیے: میں تمام انسانوں کے پروردگار کی پناہ مانگتا ہوں" },
      { num: 2, ar: "مَلِكِ النَّاسِ", ur: "تمام انسانوں کے بادشاہ کی" },
      { num: 3, ar: "إِلَٰهِ النَّاسِ", ur: "تمام انسانوں کے معبود کی" },
      { num: 4, ar: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", ur: "وسوسہ ڈالنے والے، پیچھے ہٹ جانے والے شیطان کے شر سے" },
      { num: 5, ar: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", ur: "جو لوگوں کے دلوں میں وسوسہ ڈالتا ہے" },
      { num: 6, ar: "مِنَ الْجِنَّةِ وَالنَّاسِ", ur: "خواہ وہ جنات میں سے ہو یا انسانوں میں سے" },
    ],
  },
];

export const DigitalQuranReader: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"qaida" | "quran">("qaida");
  const [qaidaLessonIdx, setQaidaLessonIdx] = useState(0);
  const [selectedSurahIdx, setSelectedSurahIdx] = useState(0);
  const [fontSize, setFontSize] = useState<"md" | "lg" | "xl">("lg");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentLesson = QAIDA_LESSONS[qaidaLessonIdx];
  const currentSurah = SURAHS[selectedSurahIdx];

  const sizeClass =
    fontSize === "xl" ? "text-3xl sm:text-5xl" : fontSize === "lg" ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl";

  return (
    <div
      className={`bg-white dark:bg-[#0b231b] rounded-3xl border border-gray-200 dark:border-emerald-800 shadow-xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none p-6 sm:p-10 overflow-y-auto" : "p-6 space-y-6"
      }`}
    >
      {/* Reader Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-emerald-900 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("qaida")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "qaida"
                ? "bg-brand-deep text-white shadow-sm"
                : "bg-gray-100 dark:bg-[#081d16] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            نورانی قاعدہ (Noorani Qaida)
          </button>
          <button
            onClick={() => setActiveTab("quran")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "quran"
                ? "bg-brand-deep text-white shadow-sm"
                : "bg-gray-100 dark:bg-[#081d16] text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            قرآنِ مجید (Holy Quran)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-gray-200 dark:border-emerald-800 overflow-hidden text-xs">
            <button
              onClick={() => setFontSize("md")}
              className={`px-2.5 py-1 font-bold ${fontSize === "md" ? "bg-brand-emerald text-white" : "text-gray-600"}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-2.5 py-1 font-bold ${fontSize === "lg" ? "bg-brand-emerald text-white" : "text-gray-600"}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("xl")}
              className={`px-2.5 py-1 font-bold ${fontSize === "xl" ? "bg-brand-emerald text-white" : "text-gray-600"}`}
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border border-gray-200 dark:border-emerald-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#081d16]"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen for Live Class"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Qaida Mode */}
      {activeTab === "qaida" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-150 dark:border-emerald-800/60">
            <div>
              <span className="text-[11px] font-bold text-brand-emerald dark:text-brand-gold uppercase tracking-wider block">
                {currentLesson.titleEn}
              </span>
              <h3 className="font-arabic text-lg font-bold text-gray-900 dark:text-white">
                {currentLesson.titleUr}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={qaidaLessonIdx === 0}
                onClick={() => setQaidaLessonIdx((i) => Math.max(0, i - 1))}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-emerald-800 text-xs font-bold disabled:opacity-30"
              >
                Previous Lesson
              </button>
              <button
                disabled={qaidaLessonIdx === QAIDA_LESSONS.length - 1}
                onClick={() => setQaidaLessonIdx((i) => Math.min(QAIDA_LESSONS.length - 1, i + 1))}
                className="px-3 py-1.5 rounded-xl bg-brand-deep hover:bg-brand-emerald text-white text-xs font-bold disabled:opacity-30"
              >
                Next Lesson
              </button>
            </div>
          </div>

          {/* Interactive Letters Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {currentLesson.letters.map((letter, idx) => (
              <div
                key={idx}
                className="group relative p-6 sm:p-8 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/60 bg-gradient-to-b from-white to-gray-50/80 dark:from-[#0b231b] dark:to-[#081d16] hover:border-brand-gold hover:shadow-lg transition-all flex flex-col items-center justify-center cursor-pointer"
              >
                <span
                  className={`font-arabic font-bold text-gray-900 dark:text-white text-center leading-relaxed group-hover:text-brand-emerald group-hover:scale-110 transition-all ${sizeClass}`}
                  dir="rtl"
                >
                  {letter}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quran Mode */}
      {activeTab === "quran" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-150 dark:border-emerald-800/60">
            <div>
              <span className="text-[11px] font-bold text-brand-emerald dark:text-brand-gold uppercase tracking-wider block">
                Surah #{currentSurah.number} • {currentSurah.name}
              </span>
              <h3 className="font-arabic text-xl font-bold text-gray-900 dark:text-white">
                سورة {currentSurah.nameArabic}
              </h3>
            </div>

            <select
              value={selectedSurahIdx}
              onChange={(e) => setSelectedSurahIdx(Number(e.target.value))}
              className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-emerald-800 bg-white dark:bg-[#081d16] text-xs font-semibold"
            >
              {SURAHS.map((s, idx) => (
                <option key={s.number} value={idx}>
                  {s.number}. {s.name} ({s.nameArabic})
                </option>
              ))}
            </select>
          </div>

          {/* Ayahs Display */}
          <div className="space-y-4">
            {currentSurah.ayahs.map((ayah) => (
              <div
                key={ayah.num}
                className="p-5 rounded-2xl bg-gray-50/80 dark:bg-[#081d16] border border-gray-100 dark:border-emerald-900/40 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-950 pb-2">
                  <span className="w-7 h-7 rounded-full bg-brand-deep text-brand-gold font-bold text-xs flex items-center justify-center">
                    {ayah.num}
                  </span>
                </div>

                <p
                  className={`font-arabic text-right leading-loose text-gray-900 dark:text-white ${sizeClass}`}
                  dir="rtl"
                >
                  {ayah.ar}
                </p>

                <p className="text-xs text-gray-600 dark:text-gray-300 text-right leading-relaxed font-arabic" dir="rtl">
                  {ayah.ur}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
