import { BlogCard } from "./blog-card";
import type { BlogPostWithRelations } from "@/types";

interface BlogListProps {
  posts: BlogPostWithRelations[];
  locale: string;
}

export function BlogList({ posts, locale }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {locale === "tr" ? "Henüz yazı bulunmuyor." : "No articles found."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} locale={locale} />
      ))}
    </div>
  );
}
