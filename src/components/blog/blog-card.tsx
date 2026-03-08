"use client";

import { useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { getLocalizedField, formatDate } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import type { BlogPostWithRelations } from "@/types";

interface BlogCardProps {
  post: BlogPostWithRelations;
  locale: string;
}

export function BlogCard({ post, locale }: BlogCardProps) {
  const title = getLocalizedField(post, "title", locale);
  const excerpt = getLocalizedField(post, "excerpt", locale);
  const categoryName = post.category
    ? getLocalizedField(post.category, "name", locale)
    : null;

  /* ─── Spotlight ─── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const spotlight = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(182,140,90,0.08), transparent 80%)`;

  return (
    <article className="group relative" onMouseMove={handleMouseMove}>
      <div className="relative bg-[#111111] rounded-2xl group-hover:bg-[#181818] transition-all duration-500 hover:scale-[1.02] overflow-hidden">
        {/* Mouse spotlight */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[2]"
          style={{ background: spotlight }}
        />

        {post.featuredImage && (
          <Link href={`/blog/${post.slug}`}>
            <div className="aspect-video overflow-hidden">
              <img
                src={post.featuredImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
        <div className="p-6 relative z-[1]">
          {categoryName && (
            <span className="inline-block text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">
              {categoryName}
            </span>
          )}
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-xl font-semibold font-heading text-white mb-2 group-hover:text-brand-400 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          {excerpt && (
            <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
              {excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt?.toISOString()}>
                {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
              </time>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="flex items-center gap-1 text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              <span>{locale === "tr" ? "Devamini Oku" : "Read More"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Animated bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden z-[2]">
          <div className="w-0 h-full bg-gradient-to-r from-brand-600 to-brand-400 group-hover:w-full transition-all duration-700 ease-out" />
        </div>
      </div>
    </article>
  );
}
