import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/blog/blog-card";
import type { BlogPostWithRelations } from "@/types";

interface FeaturedArticlesProps {
  locale: string;
}

export async function FeaturedArticles({ locale }: FeaturedArticlesProps) {
  const t = await getTranslations("featuredArticles");

  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  } catch {
    // DB not available
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f5f5f3]" style={{ padding: "var(--section-py) var(--section-px)" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-end justify-between" style={{ marginBottom: "var(--space-2xl)" }}>
          <div>
            <h2 className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-4xl)" }}>
              {t("title")}
            </h2>
            <p className="text-[#666]" style={{ fontSize: "var(--fs-base)", marginTop: "var(--space-sm)", maxWidth: "36rem" }}>
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-3 tracking-[0.15em] uppercase text-[#1a1a1a] group"
            style={{ fontSize: "var(--fs-xs)" }}
          >
            <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "var(--space-xl)" }}>
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post as unknown as BlogPostWithRelations}
              locale={locale}
            />
          ))}
        </div>

        <div className="sm:hidden" style={{ marginTop: "var(--space-xl)" }}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 tracking-[0.15em] uppercase text-[#1a1a1a] group"
            style={{ fontSize: "var(--fs-xs)" }}
          >
            <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
