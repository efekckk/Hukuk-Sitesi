import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { AboutBento } from '@/components/sections/about-bento';
import { PageHero } from "@/components/sections/page-hero";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations('about');

  const [aboutSettings, dbValues, statsSettings] = await Promise.all([
    prisma.siteSetting.findMany({ where: { group: "about" } }),
    prisma.value.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSetting.findMany({ where: { group: "stats" } }),
  ]);

  const aboutMap = Object.fromEntries(aboutSettings.map((s) => [s.key, s]));
  const description = (locale === "en" && aboutMap.about_description?.valueEn)
    ? aboutMap.about_description.valueEn
    : aboutMap.about_description?.valueTr || t('description');

  const values = dbValues.length > 0
    ? dbValues.map((v) => ({
        icon: v.icon,
        title: (locale === "en" && v.titleEn) ? v.titleEn : v.titleTr,
        description: (locale === "en" && v.descriptionEn) ? v.descriptionEn : v.descriptionTr,
      }))
    : [
        { icon: "Award", title: t('values.integrity.title'), description: t('values.integrity.description') },
        { icon: "BookOpen", title: t('values.expertise.title'), description: t('values.expertise.description') },
        { icon: "Heart", title: t('values.dedication.title'), description: t('values.dedication.description') },
      ];

  // Build stats as { value, suffix, label } for bento grid
  const statsMap = Object.fromEntries(statsSettings.map((s) => [s.key, s]));
  const statsData = ["experience", "cases", "clients"]
    .map((key) => {
      const valueSetting = statsMap[`stat_${key}_value`];
      const suffixSetting = statsMap[`stat_${key}_suffix`];
      const labelSetting = statsMap[`stat_${key}_label`];
      if (!valueSetting) return null;
      return {
        value: parseInt(valueSetting.valueTr || "0", 10),
        suffix: suffixSetting?.valueTr || "+",
        label: (locale === "en" && labelSetting?.valueEn) ? labelSetting.valueEn : (labelSetting?.valueTr || ""),
      };
    })
    .filter(Boolean) as { value: number; suffix: string; label: string }[];

  return (
    <main>
      {/* Hero Section */}
      <PageHero title={t('title')} subtitle={t('subtitle')} backgroundImage="/images/cinematic/inner-hero-law.jpg" />

      {/* Bento Grid: Description + Stats + Values */}
      <AboutBento
        description={description}
        stats={statsData}
        values={values}
      />
    </main>
  );
}
