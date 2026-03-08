import { getTranslations } from 'next-intl/server';
import { Award, BookOpen, Heart, Shield, Briefcase, Scale, Users, Star, Target, Lightbulb } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHero } from "@/components/sections/page-hero";

interface ValuesPageProps {
  params: Promise<{ locale: string }>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
    <main>
      {/* Hero Section */}
      <PageHero title={t('title')} subtitle={t('subtitle')} backgroundImage="/images/cinematic/inner-hero-law.jpg" />

      {/* Description */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-neutral-400 leading-relaxed text-center">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="pb-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const Icon = iconMap[value.icon] || Award;
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className="relative bg-[#111111] p-8 rounded-2xl text-center group-hover:bg-[#181818] group-hover:scale-[1.02] transition-all duration-500">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/[0.05] rounded-full mb-5 border border-white/[0.06]">
                      <Icon className="w-8 h-8 text-brand-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {value.title}
                    </h3>
                    <p className="text-neutral-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
