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
  const categoryName = post.category ? getLocalizedField(post.category, "name", locale) : null;

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
      <div className="flex flex-col flex-1" style={{ paddingTop: "var(--space-lg)" }}>
        {categoryName && (
          <span className="tracking-widest uppercase text-white/30" style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-xs)" }}>
            {categoryName}
          </span>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-serif font-light text-white leading-snug transition-colors group-hover:text-white/70 line-clamp-2" style={{ fontSize: "var(--fs-xl)" }}>
            {title}
          </h3>
        </Link>
        {excerpt && (
          <p className="leading-relaxed text-white/40 line-clamp-3 flex-1" style={{ fontSize: "var(--fs-sm)", marginTop: "var(--space-xs)" }}>
            {excerpt}
          </p>
        )}
        <div className="flex items-center text-white/20" style={{ fontSize: "var(--fs-micro)", marginTop: "var(--space-sm)", gap: "var(--space-xs)" }}>
          <Calendar style={{ width: "0.85em", height: "0.85em" }} />
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt ? formatDate(post.publishedAt, locale) : ""}
          </time>
        </div>
      </div>
    </article>
  );
}
