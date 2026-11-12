"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { COURSES } from "@/data/courses";
import { TEACHER_PROFILES } from "@/data/teachers";
import { PRICING_PLANS } from "@/data/pricing";
import { BLOG_POSTS } from "@/data/blog";
import { FAQS } from "@/data/faqs";
import { DEFAULT_WEBSITE_CONTENT, DEFAULT_WEBSITE_SETTINGS } from "@/lib/default-content";
import type { PublicSiteBundle } from "@/lib/public-data";

const INITIAL_BUNDLE: PublicSiteBundle = {
  courses: COURSES,
  teachers: TEACHER_PROFILES,
  pricingPlans: PRICING_PLANS,
  blogs: BLOG_POSTS,
  faqs: FAQS,
  testimonials: [],
  gallery: [],
  websiteContent: DEFAULT_WEBSITE_CONTENT,
  settings: DEFAULT_WEBSITE_SETTINGS,
  isLiveFirebase: false,
};

const PublicDataContext = createContext<PublicSiteBundle & { loading: boolean; refresh: () => Promise<void> }>({
  ...INITIAL_BUNDLE,
  loading: false,
  refresh: async () => {},
});

export const PublicDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [bundle, setBundle] = useState<PublicSiteBundle>(INITIAL_BUNDLE);
  const [loading, setLoading] = useState(true);

  const fetchLive = async () => {
    try {
      const res = await fetch("/api/public/data", { cache: "no-store" });
      if (res.ok) {
        const data: PublicSiteBundle = await res.json();
        setBundle(data);
      }
    } catch {
      // Keep graceful defaults on offline/error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLive();
  }, []);

  return (
    <PublicDataContext.Provider value={{ ...bundle, loading, refresh: fetchLive }}>
      {children}
    </PublicDataContext.Provider>
  );
};

export const usePublicData = () => useContext(PublicDataContext);
