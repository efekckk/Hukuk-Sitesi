import { getTranslations } from 'next-intl/server';
import { Award, BookOpen, Heart, Shield, Briefcase, Scale, Users, Star, Target, Lightbulb } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHero } from "@/components/sections/page-hero";

interface ValuesPageProps {
  params: Promise<{ locale: string }>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Award, BookOpen, Heart, Shield, Briefcase, Scale, Users, Star, Target, Lightbulb,
};

export default async function ValuesPage({ params }: ValuesPageProps) {
  const { locale } = await params;
  const t = await getTranslations('valuesPage');

  const dbValues = await prisma.value.findMany({ orderBy: { order: "asc" } });

  const values = dbValues.length > 0
    ? dbValues.map((v) => ({
        icon: v.icon,
        title: (locale === "en" && v.titleEn) ? v.titleEn : v.titleTr,
        description: (locale === "en" && v.descriptionEn) ? v.descriptionEn : v.descriptionTr,
      }))
    : [
        { icon: "Award", title: t('integrity.title'), description: t('integrity.description') },
        { icon: "BookOpen", title: t('expertise.title'), description: t('expertise.description') },
        { icon: "Heart", title: t('dedication.title'), description: t('dedication.description') },
      ];

  return (
    <main className="bg-[#0a0a0a]">
      <PageHero title={t('title')} subtitle={t('subtitle')} backgroundImage="/images/cinematic/inner-hero-law.jpg" />

      {/* Description */}
      <section style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="leading-relaxed text-white/50" style={{ fontSize: "var(--fs-md)" }}>
            {t('description')}
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section style={{ paddingBottom: "var(--section-py)", paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)" }}>
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3" style={{ gap: "var(--space-lg)" }}>
          {values.map((value, index) => {
            const Icon = iconMap[value.icon] || Award;
            return (
              <div key={index} className="group relative">
                <div className="relative bg-[#111111] text-center group-hover:bg-[#181818] transition-colors duration-500" style={{ padding: "var(--space-xl)", borderRadius: "1rem" }}>
                  <div
                    className="inline-flex items-center justify-center bg-white/[0.05] border border-white/[0.06]"
                    style={{ width: "clamp(3rem,4vw,4.5rem)", height: "clamp(3rem,4vw,4.5rem)", borderRadius: "50%", marginBottom: "var(--space-md)" }}
                  >
                    <Icon className="text-[#b8975a]" style={{ width: "var(--fs-2xl)", height: "var(--fs-2xl)" }} />
                  </div>
                  <h3 className="font-semibold text-white" style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--space-sm)" }}>
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-white/50" style={{ fontSize: "var(--fs-sm)" }}>
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
