import { HeroSlider } from "@/components/sections/hero-slider";
import { StoryTabs } from "@/components/sections/story-tabs";
import { HomepageBento } from "@/components/sections/homepage-bento";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { TeamCinematic } from "@/components/sections/team-cinematic";
import { GlowDivider } from "@/components/glow-divider";
import { prisma } from "@/lib/prisma";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  const [
    dbMembers,
    dbFaqItems,
    dbPracticeAreas,
    dbTestimonials,
    dbHeroSlides,
    statsSettings,
    ctaSettings,
    phoneRawSetting,
  ] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    prisma.faqItem.findMany({ orderBy: { order: "asc" } }),
    prisma.practiceArea.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.siteSetting.findMany({ where: { group: "stats" } }),
    prisma.siteSetting.findMany({ where: { group: "cta" } }),
    prisma.siteSetting.findFirst({ where: { key: "phone_raw" } }),
  ]);

  const teamMembers = dbMembers.map((m) => ({
    name: (locale === "en" && m.nameEn) ? m.nameEn : m.nameTr,
    role: (locale === "en" && m.roleEn) ? m.roleEn : m.roleTr,
    specialty: (locale === "en" && m.specialtyEn) ? m.specialtyEn : m.specialtyTr,
    image: m.image,
  }));

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

  const heroSlides = dbHeroSlides.map((s) => ({
    tagline: (locale === "en" && s.taglineEn) ? s.taglineEn : s.taglineTr,
    title: (locale === "en" && s.titleEn) ? s.titleEn : s.titleTr,
    subtitle: (locale === "en" && s.subtitleEn) ? s.subtitleEn : s.subtitleTr,
    ctaText: (locale === "en" && s.ctaTextEn) ? s.ctaTextEn : s.ctaTextTr,
    ctaLink: s.ctaLink,
    secondaryCtaText: s.secondaryCtaTextTr
      ? ((locale === "en" && s.secondaryCtaTextEn) ? s.secondaryCtaTextEn : s.secondaryCtaTextTr)
      : undefined,
    secondaryCtaLink: s.secondaryCtaLink || undefined,
    secondaryCtaIsExternal: s.secondaryCtaIsExternal,
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
    <>
      <HeroSlider
        slides={heroSlides.length > 0 ? heroSlides : undefined}
        tickerItems={practiceAreas.length > 0 ? practiceAreas.map((a) => a.title) : undefined}
      />
      <GlowDivider />
      <StoryTabs />
      <GlowDivider />
      <HomepageBento
        practiceAreas={practiceAreas}
        stats={statsData}
      />
      <GlowDivider />
      <FeaturedArticles locale={locale} />
      <GlowDivider />
      <TeamCinematic members={teamMembers} />
      <GlowDivider />
      <Testimonials testimonials={testimonials.length > 0 ? testimonials : undefined} />
      <GlowDivider />
      <Faq items={faqItems.length > 0 ? faqItems : undefined} />
      <GlowDivider />
      <Cta
        title={ctaTitle}
        subtitle={ctaSubtitle}
        buttonText={ctaButtonText}
        phoneText={ctaPhoneText}
        phoneRaw={phoneRaw}
      />
    </>
  );
}
