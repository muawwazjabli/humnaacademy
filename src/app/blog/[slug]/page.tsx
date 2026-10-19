import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  User,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Share2,
  BookOpen,
  MessageCircle
} from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";
import { buildWhatsAppLink, ACADEMY_CONFIG } from "@/lib/constants";
import { Metadata } from "next";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return { title: "Article Not Found | Humna Academy" };
  }
  return {
    title: `${post.title} | Humna Academy Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Humna Academy`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-emerald hover:text-brand-deep transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-brand-emerald text-xs font-semibold border border-emerald-100">
            {post.category}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{post.readTime}</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between gap-4 py-4 border-y border-gray-100 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-deep text-brand-gold flex items-center justify-center font-bold">
              HA
            </div>
            <div>
              <span className="font-semibold text-gray-900 block">{post.author.name}</span>
              <span className="text-[11px] text-gray-400">{post.author.role}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-gray-400 block text-[11px]">Published</span>
            <span className="font-medium text-gray-800">{post.publishedAt}</span>
          </div>
        </div>
      </div>

      {/* Draft Disclaimer Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Scholarly Review Notice:</strong> {post.draftNotice}
        </p>
      </div>

      {/* Article Body */}
      <div className="prose prose-emerald max-w-none text-gray-800 leading-relaxed text-sm sm:text-base space-y-6">
        {post.content.split("\n\n").map((paragraph, idx) => {
          if (paragraph.startsWith("### ")) {
            return (
              <h2 key={idx} className="font-serif font-bold text-xl sm:text-2xl text-gray-900 pt-4 pb-1">
                {paragraph.replace("### ", "")}
              </h2>
            );
          }
          if (paragraph.startsWith("> ")) {
            return (
              <blockquote key={idx} className="border-l-4 border-brand-gold pl-4 py-1 italic bg-brand-cream/30 rounded-r-xl my-4 text-gray-800">
                {paragraph.replace("> ", "")}
              </blockquote>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 mr-2">Tags:</span>
        {post.tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Direct Trial CTA Box */}
      <div className="bg-brand-deep rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-brand-gold/30">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif font-bold text-xl">
            Inspired to learn Quran with personal guidance?
          </h3>
          <p className="text-xs text-brand-cream/80">
            Book a free 30-minute introductory lesson with a certified Humna Academy instructor.
          </p>
        </div>
        <Link
          href="/book-trial"
          className="px-6 py-3 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-deep font-bold text-xs shrink-0 shadow-md"
        >
          Book Free Trial
        </Link>
      </div>

      {/* Related Posts */}
      <div className="pt-10 border-t border-gray-100 space-y-6">
        <h3 className="font-serif font-bold text-2xl text-gray-900">
          Related Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((rel) => (
            <Link
              key={rel.slug}
              href={`/blog/${rel.slug}`}
              className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-brand-emerald/40 hover:shadow-md transition-all space-y-2 group"
            >
              <span className="text-[11px] font-semibold text-brand-emerald block">
                {rel.category}
              </span>
              <h4 className="font-serif font-bold text-sm text-gray-900 group-hover:text-brand-emerald transition-colors line-clamp-2">
                {rel.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2">
                {rel.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
