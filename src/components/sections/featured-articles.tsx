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
    <section className="bg-[#f5f5f3] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-4xl font-light text-[#1a1a1a] lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-base text-[#666] max-w-xl">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-3 text-sm tracking-[0.15em] uppercase text-[#1a1a1a] group"
          >
            <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post as unknown as BlogPostWithRelations}
              locale={locale}
            />
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 text-sm tracking-[0.15em] uppercase text-[#1a1a1a] group"
          >
            <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
