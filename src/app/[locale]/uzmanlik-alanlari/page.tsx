import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { prisma } from "@/lib/prisma";

interface PracticeAreasPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PracticeAreasPage({ params }: PracticeAreasPageProps) {
  const { locale } = await params;
  const t = await getTranslations("practiceAreas");

  const dbAreas = await prisma.practiceArea.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        backgroundImage="/images/gavel-stock.jpg"
      />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {dbAreas.map((area, index) => {
              const title =
                locale === "en" && area.titleEn ? area.titleEn : area.titleTr;
              const description =
                locale === "en" && area.descriptionEn
                  ? area.descriptionEn
                  : area.descriptionTr;

              // Alternate cards: odd-indexed with image overlay, even without
              const cardImages = [
                "/images/handshake.jpg",
                null,
                "/images/gavel-stock.jpg",
                null,
                "/images/lawyer-client.jpg",
                null,
                "/images/team-meeting.jpg",
                null,
              ];
              const bgImage = cardImages[index % cardImages.length];

              return (
                <Link
                  key={area.id}
                  href={`/uzmanlik-alanlari/${area.slug}`}
                  className="group relative aspect-square overflow-hidden bg-[#1a1a1a]"
                >
                  {/* Background photo or solid dark */}
                  {bgImage ? (
                    <img
                      src={bgImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: "grayscale(30%) brightness(0.45)" }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#111] transition-colors duration-500 group-hover:bg-[#1a1a1a]" />
                  )}

                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h3 className="font-serif text-2xl font-light text-white leading-tight">
                      {title}
                    </h3>
                    {description && (
                      <p className="mt-3 text-sm leading-relaxed text-white/50 line-clamp-3">
                        {description}
                      </p>
                    )}
                    <span className="mt-4 text-xs tracking-widest uppercase text-white/30 transition-colors group-hover:text-white/60">
                      {t("detailLink")} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
