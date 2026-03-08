import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero } from "@/components/sections/page-hero";
import {
  Shield,
  Heart,
  Briefcase,
  Building2,
  Landmark,
  Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface PracticeAreasPageProps {
  params: Promise<{ locale: string }>;
}

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Heart,
  Briefcase,
  Building2,
  Landmark,
  Home,
};

const fallbackAreas = [
  { icon: Shield, key: 'criminal', slug: 'ceza-hukuku' },
  { icon: Heart, key: 'family', slug: 'aile-hukuku' },
  { icon: Briefcase, key: 'labor', slug: 'is-hukuku' },
  { icon: Building2, key: 'commercial', slug: 'ticaret-hukuku' },
  { icon: Landmark, key: 'administrative', slug: 'idare-hukuku' },
  { icon: Home, key: 'realEstate', slug: 'gayrimenkul-hukuku' },
] as const;

export default async function PracticeAreasPage({
  params,
}: PracticeAreasPageProps) {
  const { locale } = await params;
  const t = await getTranslations('practiceAreas');
  const ts = await getTranslations('services');

  const dbAreas = await prisma.practiceArea.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <main>
      {/* Hero Section */}
      <PageHero title={t('title')} subtitle={t('subtitle')} backgroundImage="/images/cinematic/inner-hero-business.jpg" />

      {/* Practice Areas Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbAreas.length > 0
              ? dbAreas.map((area) => {
                  const Icon = iconMap[area.icon] || Shield;
                  const title = (locale === 'en' && area.titleEn) ? area.titleEn : area.titleTr;
                  const description = (locale === 'en' && area.descriptionEn) ? area.descriptionEn : area.descriptionTr;
                  return (
                    <div
                      key={area.id}
                      className="bg-card p-8 rounded-2xl hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 hover:scale-[1.03] border-l-4 border-secondary"
                    >
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary/10 rounded-full mb-5">
                        <Icon className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {description}
                      </p>
                      <Link
                        href={`/uzmanlik-alanlari/${area.slug}`}
                        className="inline-flex items-center text-secondary font-medium hover:text-secondary-light transition-colors"
                      >
                        {t('detailLink')}
                        <span className="ml-2">&rarr;</span>
                      </Link>
                    </div>
                  );
                })
              : fallbackAreas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <div
                      key={area.key}
                      className="bg-card p-8 rounded-2xl hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 hover:scale-[1.03] border-l-4 border-secondary"
                    >
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary/10 rounded-full mb-5">
                        <Icon className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {ts(`${area.key}.title`)}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {ts(`${area.key}.description`)}
                      </p>
                      <Link
                        href={`/uzmanlik-alanlari/${area.slug}`}
                        className="inline-flex items-center text-secondary font-medium hover:text-secondary-light transition-colors"
                      >
                        {t('detailLink')}
                        <span className="ml-2">&rarr;</span>
                      </Link>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>
    </main>
  );
}
