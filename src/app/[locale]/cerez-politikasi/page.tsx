import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { PageHero } from "@/components/sections/page-hero";
import DOMPurify from "isomorphic-dompurify";

interface CookiePolicyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CookiePolicyPage({ params }: CookiePolicyPageProps) {
  const { locale } = await params;
  const t = await getTranslations('cookiePolicy');

  const page = await prisma.pageContent.findUnique({ where: { slug: "cerez-politikasi" } });

  const title = page ? ((locale === "en" && page.titleEn) ? page.titleEn : page.titleTr) : t('title');
  const content = page ? ((locale === "en" && page.contentEn) ? page.contentEn : page.contentTr) : null;

  return (
    <main>
      <PageHero title={title} backgroundImage="/images/cinematic/inner-hero-law.jpg" />

      <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-3xl">
          {content ? (
            <div
              className="prose max-w-none"
              style={{ fontSize: "var(--fs-base)" }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          ) : (
            <p className="text-black/50" style={{ fontSize: "var(--fs-base)" }}>{t('content')}</p>
          )}
        </div>
      </section>
    </main>
  );
}
