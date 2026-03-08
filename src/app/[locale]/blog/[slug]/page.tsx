import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getLocalizedField, formatDate } from "@/lib/utils";
import { BlogContent } from "@/components/blog/blog-content";
import { PageHero } from "@/components/sections/page-hero";
import { Calendar, User, FolderOpen, Eye, ArrowLeft } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Not Found" };

  const metaTitle = getLocalizedField(post, "metaTitle", locale) || getLocalizedField(post, "title", locale);
  const metaDesc = getLocalizedField(post, "metaDesc", locale) || getLocalizedField(post, "excerpt", locale);

  return {
    title: metaTitle,
    description: metaDesc,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("blog");

  const post = await getPost(slug);

  if (!post || !post.isPublished) {
    notFound();
  }

  // Increment view count
  try {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // DB not available
  }

  const title = getLocalizedField(post, "title", locale);
  const content = getLocalizedField(post, "content", locale);
  const excerpt = getLocalizedField(post, "excerpt", locale);
  const categoryName = post.category
    ? getLocalizedField(post.category, "name", locale)
    : null;

  return (
    <>
      <PageHero title={title} backgroundImage="/images/cinematic/inner-hero-writing.jpg" />

      <section className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDate(post.publishedAt, locale)}
                </time>
              </div>
            )}
            {categoryName && (
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                <span>{categoryName}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount + 1}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          {excerpt && (
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed italic border-l-4 border-secondary pl-4">
              {excerpt}
            </p>
          )}
          <BlogContent content={content} />
        </div>
      </section>

      {post.tags.length > 0 && (
        <section className="pb-12 bg-background">
          <div className="max-w-4xl mx-auto px-4">
            <div className="border-t border-border pt-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full"
                  >
                    {getLocalizedField(tag, "name", locale)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-secondary font-medium hover:text-secondary-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === "tr" ? "Blog'a Don" : "Back to Blog"}
          </Link>
        </div>
      </section>
    </>
  );
}
