import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { BlogList } from "@/components/blog/blog-list";
import { Pagination } from "@/components/ui/pagination";
import { getLocalizedField } from "@/lib/utils";
import { PageHero } from "@/components/sections/page-hero";
import { cn } from "@/lib/utils";

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
    <main>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        backgroundImage="/images/cinematic/inner-hero-writing.jpg"
      />

      <section className="bg-[#0a0a0a] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-16">
              <Link
                href="/blog"
                className={cn(
                  "px-5 py-2 text-xs tracking-widest uppercase transition-all",
                  !category
                    ? "bg-white text-[#0a0a0a]"
                    : "border border-white/20 text-white/40 hover:border-white/50 hover:text-white"
                )}
              >
                {t("allCategories")}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={cn(
                    "px-5 py-2 text-xs tracking-widest uppercase transition-all",
                    category === cat.slug
                      ? "bg-white text-[#0a0a0a]"
                      : "border border-white/20 text-white/40 hover:border-white/50 hover:text-white"
                  )}
                >
                  {getLocalizedField(cat, "name", locale)}
                </Link>
              ))}
            </div>
          )}

          <BlogList posts={posts as never} locale={locale} />

          {totalPages > 1 && (
            <div className="mt-16">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={category ? `/blog?category=${category}&page=` : "/blog?page="}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
