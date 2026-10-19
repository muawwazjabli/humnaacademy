"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "@/types";

interface LanguageContextType {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (en: string, ur: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  direction: "ltr",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (en) => en,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("humna_lang") as Language | null;
    if (saved && (saved === "en" || saved === "ur")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("humna_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ur" : "en");
  };

  const direction = language === "ur" ? "rtl" : "ltr";

  const t = (en: string, ur: string) => (language === "ur" ? ur : en);

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      <div dir={direction} className={language === "ur" ? "font-urdu" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
