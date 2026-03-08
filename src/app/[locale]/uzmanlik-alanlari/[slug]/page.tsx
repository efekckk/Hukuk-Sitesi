import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { PageHero } from "@/components/sections/page-hero";
import {
  Shield,
  Heart,
  Briefcase,
  Building2,
  Landmark,
  Home,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Heart,
  Briefcase,
  Building2,
  Landmark,
  Home,
};

// Fallback for translation-based approach
const slugToKey: Record<string, string> = {
  'ceza-hukuku': 'criminal',
  'aile-hukuku': 'family',
  'is-hukuku': 'labor',
  'ticaret-hukuku': 'commercial',
  'idare-hukuku': 'administrative',
  'gayrimenkul-hukuku': 'realEstate',
};

interface PracticeAreaDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const areas = await prisma.practiceArea.findMany({ select: { slug: true } });
    if (areas.length > 0) {
      return areas.map((a) => ({ slug: a.slug }));
    }
  } catch {
    // DB not available at build time
  }
  return Object.keys(slugToKey).map((slug) => ({ slug }));
}

export default async function PracticeAreaDetailPage({
  params,
}: PracticeAreaDetailPageProps) {
  const { locale, slug } = await params;

  // Try DB first
  const dbArea = await prisma.practiceArea.findUnique({ where: { slug } });

  if (dbArea) {
    const Icon = iconMap[dbArea.icon] || Shield;
    const title = (locale === 'en' && dbArea.titleEn) ? dbArea.titleEn : dbArea.titleTr;
    const description = (locale === 'en' && dbArea.descriptionEn) ? dbArea.descriptionEn : dbArea.descriptionTr;
    const longDescription = (locale === 'en' && dbArea.longDescEn) ? dbArea.longDescEn : dbArea.longDescTr;
    const itemsRaw = (locale === 'en' && dbArea.itemsEn) ? dbArea.itemsEn : dbArea.itemsTr;
    const items = itemsRaw.split('\n').filter((line) => line.trim() !== '');

    const tp = await getTranslations('practiceAreas');

    return (
      <main>
        <PageHero title={title} subtitle={description} backgroundImage="/images/cinematic/inner-hero-business.jpg" />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              {longDescription}
            </p>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {tp('ourServices')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border"
                  >
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-lg text-muted-foreground mb-6">{tp('contactCta')}</p>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary-light transition-colors shadow-lg shadow-secondary/25"
              >
                {tp('contactButton')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Fallback: translation-based
  const key = slugToKey[slug];
  if (!key) {
    notFound();
  }

  const ts = await getTranslations('services');
  const tp = await getTranslations('practiceAreas');

  const keyToIcon: Record<string, LucideIcon> = {
    criminal: Shield,
    family: Heart,
    labor: Briefcase,
    commercial: Building2,
    administrative: Landmark,
    realEstate: Home,
  };

  const Icon = keyToIcon[key];
  const title = ts(`${key}.title`);
  const description = ts(`${key}.description`);
  const longDescription = ts(`${key}.longDescription`);

  const itemCount = 5;
  const items: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    items.push(ts(`${key}.items.${i}`));
  }

  return (
    <main>
      <PageHero title={title} subtitle={description} backgroundImage="/images/cinematic/inner-hero-business.jpg" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            {longDescription}
          </p>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {tp('ourServices')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border"
                >
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-lg text-muted-foreground mb-6">{tp('contactCta')}</p>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary-light transition-colors shadow-lg shadow-secondary/25"
            >
              {tp('contactButton')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
