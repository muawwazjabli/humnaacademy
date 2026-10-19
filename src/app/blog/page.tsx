"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Clock, User, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";
import { useLanguage } from "@/components/LanguageContext";

export default function BlogListingPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Beginner Guide",
    "Tajweed & Recitation",
    "Hifz Guide",
    "Parenting & Education",
    "Supplications & Adhkar",
    "Foundation & Nazra"
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {t("Islamic Education & Guidance", "قرآنی رہنمائی و مضامین")}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          {t("Humna Academy Blog & Learning Resources", "تعلیمی مضامین اور قرآنی وسائل")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {t(
            "Practical tips on learning Quran, Tajweed essentials, memorization strategies, and family Islamic education.",
            "تجوید کے اصول، حفظ قرآن کے طریقے، مسنون دعائیں اور بچوں کی اسلامی تربیت پر مفید مضامین۔"
          )}
        </p>
      </div>

      {/* Draft Disclaimer Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 max-w-3xl mx-auto">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Editorial Notice:</strong> All articles published in this educational section are structured drafts prepared by curriculum researchers. Final versions are subject to continuous scholarly review by qualified Islamic educators.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-sm space-y-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("Search articles by topic, keyword, or tag...", "مضامین یا موضوع تلاش کریں...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap mr-1">
            {t("Category:", "کیٹیگری:")}
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-brand-deep text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col bg-white rounded-2xl border border-brand-border/80 hover:border-brand-gold/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
          >
            {/* Category & Time */}
            <div className="flex items-center justify-between gap-2 mb-4 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-brand-emerald border border-emerald-100">
                {post.category}
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif font-bold text-xl text-gray-900 group-hover:text-brand-emerald transition-colors mb-3 leading-snug">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>

            {/* Excerpt */}
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-6 flex-grow leading-relaxed">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {post.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author & Read More */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
              <div className="text-[11px] text-gray-500">
                <span className="font-medium text-gray-700 block">{post.author.name}</span>
                <span>{post.publishedAt}</span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-emerald group-hover:text-brand-deep transition-colors"
              >
                <span>{t("Read Article", "مضمون پڑھیں")}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${language === "ur" ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
