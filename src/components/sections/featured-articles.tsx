import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/blog/blog-card";
import { ArrowRight } from "lucide-react";
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
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="section-divider pt-4 text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post as unknown as BlogPostWithRelations}
              locale={locale}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium text-lg transition-colors"
          >
            {t("viewAll")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
