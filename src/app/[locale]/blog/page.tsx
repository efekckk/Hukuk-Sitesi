import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { BlogList } from "@/components/blog/blog-list";
import { Pagination } from "@/components/ui/pagination";
import { getLocalizedField } from "@/lib/utils";
import { PageHero } from "@/components/sections/page-hero";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}

const POSTS_PER_PAGE = 9;

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  const { page, category } = await searchParams;
  const t = await getTranslations("blog");

  const currentPage = parseInt(page || "1", 10);
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const where: Record<string, unknown> = { isPublished: true };
  if (category) {
    where.category = { slug: category };
  }

  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  let totalCount = 0;
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];

  try {
    [posts, totalCount, categories] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: POSTS_PER_PAGE,
      }),
      prisma.blogPost.count({ where }),
      prisma.category.findMany({ orderBy: { order: "asc" } }),
    ]);
  } catch {
    // DB not available
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} backgroundImage="/images/cinematic/inner-hero-writing.jpg" />

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? "bg-secondary text-white"
                  : "bg-muted text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
              }`}
            >
              {t("allCategories")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.slug
                    ? "bg-secondary text-white"
                    : "bg-muted text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
                }`}
              >
                {getLocalizedField(cat, "name", locale)}
              </Link>
            ))}
          </div>

          <BlogList posts={posts as never} locale={locale} />

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={category ? `/blog?category=${category}&page=` : "/blog?page="}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
