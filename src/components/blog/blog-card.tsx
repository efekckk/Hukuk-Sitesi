import { Link } from "@/i18n/navigation";
import { getLocalizedField, formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
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

  return (
    <article className="group flex flex-col">
      {post.featuredImage && (
        <Link href={`/blog/${post.slug}`} className="block aspect-video overflow-hidden bg-[#111]">
          <img
            src={post.featuredImage}
            alt={title}
            className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="flex flex-col flex-1 pt-6">
        {categoryName && (
          <span className="text-xs tracking-widest uppercase text-white/30 mb-3">
            {categoryName}
          </span>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-serif text-xl font-light text-white leading-snug transition-colors group-hover:text-white/70 line-clamp-2">
            {title}
          </h3>
        </Link>
        {excerpt && (
          <p className="mt-3 text-sm leading-relaxed text-white/40 line-clamp-3 flex-1">
            {excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-white/20">
          <Calendar className="w-3 h-3" />
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
          </time>
        </div>
      </div>
    </article>
  );
}
