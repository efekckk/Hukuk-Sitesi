import { Hero } from "@/components/sections/hero";
import { FirmIntro } from "@/components/sections/firm-intro";
import { StoryTabs } from "@/components/sections/story-tabs";
import { HomepageBento } from "@/components/sections/homepage-bento";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { GlowDivider } from "@/components/glow-divider";
import { prisma } from "@/lib/prisma";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  const [
    dbFaqItems,
    dbPracticeAreas,
    dbTestimonials,
    statsSettings,
    ctaSettings,
    phoneRawSetting,
  ] = await Promise.all([
    prisma.faqItem.findMany({ orderBy: { order: "asc" } }),
    prisma.practiceArea.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.siteSetting.findMany({ where: { group: "stats" } }),
    prisma.siteSetting.findMany({ where: { group: "cta" } }),
    prisma.siteSetting.findFirst({ where: { key: "phone_raw" } }),
  ]);

  const faqItems = dbFaqItems.map((f) => ({
    question: (locale === "en" && f.questionEn) ? f.questionEn : f.questionTr,
    answer: (locale === "en" && f.answerEn) ? f.answerEn : f.answerTr,
  }));

  const practiceAreas = dbPracticeAreas.map((a) => ({
    slug: a.slug,
    title: (locale === "en" && a.titleEn) ? a.titleEn : a.titleTr,
    description: (locale === "en" && a.descriptionEn) ? a.descriptionEn : a.descriptionTr,
    icon: a.icon,
  }));

  const testimonials = dbTestimonials.map((t) => ({
    name: (locale === "en" && t.nameEn) ? t.nameEn : t.nameTr,
    role: (locale === "en" && t.roleEn) ? t.roleEn : t.roleTr,
    text: (locale === "en" && t.textEn) ? t.textEn : t.textTr,
  }));

  // Build stats from settings
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

  // Build CTA props from settings
  const ctaMap = Object.fromEntries(ctaSettings.map((s) => [s.key, s]));
  const ctaTitle = locale === "en" && ctaMap.cta_title?.valueEn
    ? ctaMap.cta_title.valueEn
    : ctaMap.cta_title?.valueTr || undefined;
  const ctaSubtitle = locale === "en" && ctaMap.cta_subtitle?.valueEn
    ? ctaMap.cta_subtitle.valueEn
    : ctaMap.cta_subtitle?.valueTr || undefined;
  const ctaButtonText = locale === "en" && ctaMap.cta_button_text?.valueEn
    ? ctaMap.cta_button_text.valueEn
    : ctaMap.cta_button_text?.valueTr || undefined;
  const ctaPhoneText = locale === "en" && ctaMap.cta_phone_text?.valueEn
    ? ctaMap.cta_phone_text.valueEn
    : ctaMap.cta_phone_text?.valueTr || undefined;
  const phoneRaw = phoneRawSetting?.valueTr || undefined;

  return (
    <div style={{ marginTop: "calc(-1 * clamp(3.5rem, 4.5vw, 5rem))" }}>
      <Hero locale={locale} />
      <FirmIntro locale={locale} />
      <GlowDivider />
      <StoryTabs />
      <GlowDivider />
      <HomepageBento
        practiceAreas={practiceAreas}
        stats={statsData}
      />
      <GlowDivider />
      <Testimonials testimonials={testimonials.length > 0 ? testimonials : undefined} locale={locale} />
      <GlowDivider />
      <Faq items={faqItems.length > 0 ? faqItems : undefined} maxItems={4} showMoreLink />
      <GlowDivider />
      <Cta
        title={ctaTitle}
        subtitle={ctaSubtitle}
        buttonText={ctaButtonText}
        phoneText={ctaPhoneText}
        phoneRaw={phoneRaw}
        locale={locale}
      />
    </div>
  );
}
