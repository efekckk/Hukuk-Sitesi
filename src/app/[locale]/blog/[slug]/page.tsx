import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getLocalizedField, formatDate } from "@/lib/utils";
import { BlogContent } from "@/components/blog/blog-content";
import { PageHero } from "@/components/sections/page-hero";
import { Calendar, User, FolderOpen } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true, author: true, tags: { include: { tag: true } } },
    });
  } catch { return null; }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };
  const metaTitle = getLocalizedField(post, "metaTitle", locale) || getLocalizedField(post, "title", locale);
  const metaDesc = getLocalizedField(post, "metaDesc", locale) || getLocalizedField(post, "excerpt", locale);
  return { title: metaTitle, description: metaDesc };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  await getTranslations("blog");

  const post = await getPost(slug);
  if (!post || !post.isPublished) notFound();

  try {
    await prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });
  } catch { /* DB not available */ }

  const title = getLocalizedField(post, "title", locale);
  const content = getLocalizedField(post, "content", locale);
  const excerpt = getLocalizedField(post, "excerpt", locale);
  const categoryName = post.category ? getLocalizedField(post.category, "name", locale) : null;

  return (
    <>
      <PageHero title={title} backgroundImage="/images/cinematic/inner-hero-writing.jpg" />

      {/* Meta bar */}
      <section className="bg-white border-b border-black/[0.07]">
        <div className="mx-auto max-w-3xl" style={{ padding: "var(--space-md) var(--section-px)" }}>
          <div className="flex flex-wrap items-center" style={{ gap: "var(--space-lg)", fontSize: "var(--fs-micro)" }} >
            <span className="tracking-[0.15em] uppercase text-black/40 flex items-center" style={{ gap: "var(--space-xs)" }}>
              {post.author && (<><User style={{ width: "0.8em", height: "0.8em" }} /><span>{post.author.name}</span></>)}
            </span>
            {post.publishedAt && (
              <span className="tracking-[0.15em] uppercase text-black/40 flex items-center" style={{ gap: "var(--space-xs)" }}>
                <Calendar style={{ width: "0.8em", height: "0.8em" }} />
                <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt, locale)}</time>
              </span>
            )}
            {categoryName && (
              <span className="tracking-[0.15em] uppercase text-black/40 flex items-center" style={{ gap: "var(--space-xs)" }}>
                <FolderOpen style={{ width: "0.8em", height: "0.8em" }} />
                <span>{categoryName}</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-3xl">
          {excerpt && (
            <p
              className="font-['Cormorant_Garamond'] leading-relaxed text-black/60 italic border-l-2 border-black/20"
              style={{ fontSize: "var(--fs-xl)", paddingLeft: "var(--space-lg)", marginBottom: "var(--space-2xl)" }}
            >
              {excerpt}
            </p>
          )}
          <BlogContent content={content} />
        </div>
      </section>

      {/* Tags */}
      {post.tags.length > 0 && (
        <section className="bg-white" style={{ paddingBottom: "var(--space-lg)", paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)" }}>
          <div className="mx-auto max-w-3xl border-t border-black/[0.07]" style={{ paddingTop: "var(--space-lg)" }}>
            <div className="flex flex-wrap" style={{ gap: "var(--space-xs)" }}>
              {post.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="tracking-[0.15em] uppercase border border-black/20 text-black/50"
                  style={{ fontSize: "var(--fs-micro)", padding: "var(--space-xs) var(--space-md)" }}
                >
                  {getLocalizedField(tag, "name", locale)}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <section className="bg-white" style={{ paddingBottom: "var(--section-py)", paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)" }}>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors"
            style={{ fontSize: "var(--fs-micro)" }}
          >
            <span className="inline-block h-px bg-current transition-all duration-300 group-hover:w-12" style={{ width: "2rem" }} />
            {locale === "tr" ? "Tüm Makaleler" : "All Articles"}
          </Link>
        </div>
      </section>
    </>
  );
}
