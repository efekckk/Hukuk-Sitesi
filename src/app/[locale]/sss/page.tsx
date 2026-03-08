import { getTranslations } from 'next-intl/server';
import { Faq } from '@/components/sections/faq';
import { prisma } from '@/lib/prisma';
import { PageHero } from "@/components/sections/page-hero";

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const t = await getTranslations('faq');

  const dbFaqItems = await prisma.faqItem.findMany({
    orderBy: { order: "asc" },
  });

  const faqItems = dbFaqItems.map((f) => ({
    question: (locale === "en" && f.questionEn) ? f.questionEn : f.questionTr,
    answer: (locale === "en" && f.answerEn) ? f.answerEn : f.answerTr,
  }));

  return (
    <main>
      {/* Hero Section */}
      <PageHero title={t('title')} subtitle={t('subtitle')} backgroundImage="/images/cinematic/inner-hero-law.jpg" />

      {/* FAQ Section */}
      <Faq items={faqItems.length > 0 ? faqItems : undefined} />
    </main>
  );
}
