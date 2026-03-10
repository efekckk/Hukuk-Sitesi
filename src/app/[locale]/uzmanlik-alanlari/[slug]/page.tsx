import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { Check } from "lucide-react";
import { prisma } from "@/lib/prisma";

// Fallback for translation-based approach
const slugToKey: Record<string, string> = {
  "ceza-hukuku": "criminal",
  "aile-hukuku": "family",
  "is-hukuku": "labor",
  "ticaret-hukuku": "commercial",
  "idare-hukuku": "administrative",
  "gayrimenkul-hukuku": "realEstate",
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

/* ─── Shared layout for DB and fallback content ─── */
function DetailLayout({
  title,
  description,
  longDescription,
  items,
  ctaLabel,
  contactCta,
  contactButton,
}: {
  title: string;
  description: string;
  longDescription: string;
  items: string[];
  ctaLabel: string;
  contactCta: string;
  contactButton: string;
}) {
  return (
    <main>
      <PageHero
        title={title}
        subtitle={description}
        backgroundImage="/images/handshake.jpg"
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Two-column: text left, image right */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: description + checklist */}
            <div>
              <p className="text-base leading-relaxed text-[#555] lg:text-lg">
                {longDescription}
              </p>

              {items.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-serif text-xl font-light text-[#1a1a1a] mb-6">
                    {ctaLabel}
                  </h2>
                  <div className="divide-y divide-[#e8e4de]">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 py-4"
                      >
                        <Check className="w-4 h-4 text-[#1a1a1a]/40 mt-0.5 shrink-0" />
                        <span className="text-sm text-[#444]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA block */}
              <div className="mt-16 border border-[#e8e4de] p-8">
                <p className="text-sm text-[#555] mb-6">{contactCta}</p>
                <Link
                  href="/iletisim"
                  className="inline-block border border-[#1a1a1a] px-8 py-3 text-sm tracking-widest uppercase text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white"
                >
                  {contactButton}
                </Link>
              </div>
            </div>

            {/* Right: image placeholder / decorative */}
            <div className="hidden lg:block">
              <div className="sticky top-24 aspect-[4/5] bg-[#111] overflow-hidden">
                <img
                  src="/images/handshake.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ filter: "grayscale(40%) brightness(0.7)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function PracticeAreaDetailPage({
  params,
}: PracticeAreaDetailPageProps) {
  const { locale, slug } = await params;
  const tp = await getTranslations("practiceAreas");

  // Try DB first
  const dbArea = await prisma.practiceArea.findUnique({ where: { slug } });

  if (dbArea) {
    const title = locale === "en" && dbArea.titleEn ? dbArea.titleEn : dbArea.titleTr;
    const description =
      locale === "en" && dbArea.descriptionEn ? dbArea.descriptionEn : dbArea.descriptionTr;
    const longDescription =
      locale === "en" && dbArea.longDescEn ? dbArea.longDescEn : dbArea.longDescTr;
    const itemsRaw =
      locale === "en" && dbArea.itemsEn ? dbArea.itemsEn : dbArea.itemsTr;
    const items = itemsRaw.split("\n").filter((line) => line.trim() !== "");

    return (
      <DetailLayout
        title={title}
        description={description}
        longDescription={longDescription}
        items={items}
        ctaLabel={tp("ourServices")}
        contactCta={tp("contactCta")}
        contactButton={tp("contactButton")}
      />
    );
  }

  // Fallback: translation-based
  const key = slugToKey[slug];
  if (!key) {
    notFound();
  }

  const ts = await getTranslations("services");

  const title = ts(`${key}.title`);
  const description = ts(`${key}.description`);
  const longDescription = ts(`${key}.longDescription`);

  const itemCount = 5;
  const items: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    items.push(ts(`${key}.items.${i}`));
  }

  return (
    <DetailLayout
      title={title}
      description={description}
      longDescription={longDescription}
      items={items}
      ctaLabel={tp("ourServices")}
      contactCta={tp("contactCta")}
      contactButton={tp("contactButton")}
    />
  );
}
