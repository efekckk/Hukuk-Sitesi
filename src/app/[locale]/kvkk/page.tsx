import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { PageHero } from "@/components/sections/page-hero";

interface KvkkPageProps {
  params: Promise<{ locale: string }>;
}

export default async function KvkkPage({ params }: KvkkPageProps) {
  const { locale } = await params;
  const t = await getTranslations('kvkk');

  const page = await prisma.pageContent.findUnique({
    where: { slug: "kvkk" },
  });

  const title = page
    ? ((locale === "en" && page.titleEn) ? page.titleEn : page.titleTr)
    : t('title');

  const content = page
    ? ((locale === "en" && page.contentEn) ? page.contentEn : page.contentTr)
    : null;

  return (
    <main>
      {/* Hero Section */}
      <PageHero title={title} backgroundImage="/images/cinematic/inner-hero-law.jpg" />

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {content ? (
            <div
              className="prose prose-lg max-w-none prose-headings:text-secondary prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-ul:space-y-2"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground">{t('content')}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
