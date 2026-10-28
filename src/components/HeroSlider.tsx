"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Calendar, MessageCircle } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { ACADEMY_CONFIG } from "@/lib/constants";

interface SlideItem {
  id: number;
  image: string;
  altEn: string;
  altUr: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    image: "/1.jpg",
    altEn: "Humna Academy Online Quran Classes - Slide 1",
    altUr: "حُمنہ اکیڈمی آن لائن قرآن کلاسز - سلائیڈ 1",
  },
  {
    id: 2,
    image: "/2.jpg",
    altEn: "Humna Academy Qualified Quran Teachers - Slide 2",
    altUr: "حُمنہ اکیڈمی مستند اساتذہ کرام - سلائیڈ 2",
  },
  {
    id: 3,
    image: "/3.jpg",
    altEn: "Humna Academy Tajweed and Hifz Lessons - Slide 3",
    altUr: "حُمنہ اکیڈمی تجوید اور حفظ قرآن - سلائیڈ 3",
  },
  {
    id: 4,
    image: "/4.jpg",
    altEn: "Humna Academy Flexible International Timings - Slide 4",
    altUr: "حُمنہ اکیڈمی لچکدار اوقات کار - سلائیڈ 4",
  },
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const { t, language } = useLanguage();

  const totalSlides = SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // minimum swipe distance

    if (diff > threshold) {
      // Swiped left
      language === "ur" ? prevSlide() : nextSlide();
    } else if (diff < -threshold) {
      // Swiped right
      language === "ur" ? nextSlide() : prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-brand-gold/30 bg-black/90">
        {/* Aspect Ratio Container for 3168 x 1344 widescreen banners */}
        <div
          className="relative w-full aspect-[16/8] sm:aspect-[21/9] min-h-[220px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[480px] overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {SLIDES.map((slide, index) => {
            const isActive = index === current;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 pointer-events-none scale-[1.02]"
                } transition-transform duration-1000`}
              >
                <Image
                  src={slide.image}
                  alt={language === "ur" ? slide.altUr : slide.altEn}
                  fill
                  priority={index === 0}
                  className="object-cover object-center w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1280px"
                />
                {/* Subtle gradient vignette at bottom to enhance contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
              </div>
            );
          })}

          {/* Previous Arrow Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-brand-deep/80 text-white hover:text-brand-gold border border-white/20 hover:border-brand-gold/60 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Next Arrow Button */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-brand-deep/80 text-white hover:text-brand-gold border border-white/20 hover:border-brand-gold/60 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Slide Indicator Dots & Counter */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
            {SLIDES.map((slide, index) => {
              const active = index === current;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    active
                      ? "w-7 sm:w-9 h-2 sm:h-2.5 bg-gradient-to-r from-brand-gold to-brand-goldLight shadow-sm shadow-brand-gold/50"
                      : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/80"
                  }`}
                />
              );
            })}
            <span className="text-[10px] sm:text-xs font-semibold text-brand-gold ml-1 tabular-nums">
              0{current + 1} / 0{totalSlides}
            </span>
          </div>
        </div>

        {/* Quick Action Strip Below Slider */}
        <div className="bg-gradient-to-r from-brand-deep via-[#10382C] to-brand-deep px-4 py-3 sm:px-6 sm:py-3.5 border-t border-brand-gold/30 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-cream">
            <span className="inline-flex p-1 rounded-full bg-brand-gold/20 text-brand-gold">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium">
              {t(
                "Experience live 1-on-1 Quran learning tailored to your child or yourself.",
                "بچوں اور بڑوں کے لیے تجوید و ناظرہ قرآن کی ون ٹو ون کلاسز۔"
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/book-trial"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-deep text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-deep" />
              <span>{t("Book Free Trial", "مفت ٹرائل بک کریں")}</span>
            </Link>

            <a
              href={`https://wa.me/${ACADEMY_CONFIG.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-emerald-600/30 text-brand-cream text-xs sm:text-sm font-medium border border-white/20 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
