import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { BlogList } from "@/components/blog/blog-list";
import { Pagination } from "@/components/ui/pagination";
import { getLocalizedField, cn } from "@/lib/utils";
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
  if (category) where.category = { slug: category };

  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  let totalCount = 0;
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];

  try {
    [posts, totalCount, categories] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { category: true, author: true, tags: { include: { tag: true } } },
        orderBy: { publishedAt: "desc" },
        skip,
        take: POSTS_PER_PAGE,
      }),
      prisma.blogPost.count({ where }),
      prisma.category.findMany({ orderBy: { order: "asc" } }),
    ]);
  } catch { /* DB not available */ }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <main>
      <PageHero title={t("title")} subtitle={t("subtitle")} backgroundImage="/images/cinematic/inner-hero-writing.jpg" />

      <section className="bg-[#0a0a0a]" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">

          {categories.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: "var(--space-xs)", marginBottom: "var(--space-2xl)" }}>
              <Link
                href="/blog"
                className={cn(
                  "tracking-widest uppercase transition-all",
                  !category ? "bg-white text-[#0a0a0a]" : "border border-white/20 text-white/40 hover:border-white/50 hover:text-white"
                )}
                style={{ fontSize: "var(--fs-micro)", padding: "var(--space-xs) var(--space-md)" }}
              >
                {t("allCategories")}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={cn(
                    "tracking-widest uppercase transition-all",
                    category === cat.slug ? "bg-white text-[#0a0a0a]" : "border border-white/20 text-white/40 hover:border-white/50 hover:text-white"
                  )}
                  style={{ fontSize: "var(--fs-micro)", padding: "var(--space-xs) var(--space-md)" }}
                >
                  {getLocalizedField(cat, "name", locale)}
                </Link>
              ))}
            </div>
          )}

          <BlogList posts={posts as never} locale={locale} />

          {totalPages > 1 && (
            <div style={{ marginTop: "var(--space-2xl)" }}>
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
