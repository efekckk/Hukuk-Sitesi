import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { RevealCard } from "@/components/ui/reveal-card";

interface PracticeAreasPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PracticeAreasPage({ params }: PracticeAreasPageProps) {
  const { locale } = await params;
  const t = await getTranslations("practiceAreas");

  const dbAreas = await prisma.practiceArea.findMany({ orderBy: { order: "asc" } });

  const areas = dbAreas.map((area) => ({
    slug: area.slug,
    title: locale === "en" && area.titleEn ? area.titleEn : area.titleTr,
    description: locale === "en" && area.descriptionEn ? area.descriptionEn : area.descriptionTr,
    image: area.image,
  }));

  return (
    <main className="bg-white">

      {/* Hero banner */}
      <div className="relative bg-[#0a0a0a] overflow-hidden flex items-end" style={{ minHeight: "clamp(18rem, 40vh, 28rem)", paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)", paddingBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/services-hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center grayscale-[30%] brightness-[0.4]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <h1
            className="font-serif font-light text-white leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", marginBottom: "0.75rem" }}
          >
            {t("title")}
          </h1>
          <nav className="text-white/35" style={{ fontSize: "var(--fs-micro)" }}>
            <Link href="/" className="hover:text-white/60 transition-colors">{locale !== "en" ? "Anasayfa" : "Home"}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white/50">{t("title")}</span>
          </nav>
        </div>
      </div>

      {/* Intro: sol metin + sağ fotoğraf */}
      <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2" style={{ gap: "var(--space-2xl)" }}>

          <div className="flex flex-col justify-center">
            <p className="tracking-[0.3em] uppercase text-[#b8975a]" style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-lg)" }}>
              {t("tagline")}
            </p>
            <p className="leading-[1.85] text-[#333]" style={{ fontSize: "var(--fs-base)", marginBottom: "var(--space-md)" }}>
              {t("intro1")}
            </p>
            <p className="leading-[1.85] text-[#555]" style={{ fontSize: "var(--fs-base)", marginBottom: "var(--space-md)" }}>
              {t("intro2")}
            </p>
            <p className="leading-[1.85] text-[#555]" style={{ fontSize: "var(--fs-base)" }}>
              {t("intro3")}
            </p>
            <div style={{ marginTop: "var(--space-xl)" }}>
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-4 tracking-[0.18em] uppercase text-[#1a1a1a] group"
                style={{ fontSize: "var(--fs-xs)" }}
              >
                <span className="h-px w-8 bg-[#1a1a1a]/30 transition-all duration-500 group-hover:w-14 group-hover:bg-[#b8975a]" />
                <span className="transition-colors group-hover:text-[#b8975a]">{t("contactButton")}</span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center">
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#111]">
              <img src="/images/businessmen-investors-shake-hands-with-lawyers-to-2026-01-08-02-27-24-utc.jpg.webp" alt="" className="h-full w-full object-cover" style={{ filter: "grayscale(15%) brightness(0.7)" }} />
              <div className="absolute inset-5 border border-white/8 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Çalışma Alanları Grid */}
      <section className="bg-[#eeecea]" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="tracking-[0.35em] uppercase text-black/35" style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-2xl)" }}>
            {t("areasTitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(0.5rem, 0.8vw, 1rem)" }}>
            {areas.map((area, i) => (
              <RevealCard
                key={area.slug}
                href={`/hizmetlerimiz/${area.slug}`}
                title={area.title}
                description={area.description}
                image={area.image ?? null}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Alt CTA */}
      <section className="bg-[#0a0a0a]" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between" style={{ gap: "var(--space-xl)" }}>
          <p className="font-serif font-light text-white leading-snug" style={{ fontSize: "var(--fs-2xl)", maxWidth: "32rem" }}>
            {t("contactCta")}
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-4 shrink-0 tracking-[0.18em] uppercase text-white/50 group hover:text-white transition-colors"
            style={{ fontSize: "var(--fs-xs)" }}
          >
            <span className="h-px w-8 bg-white/20 transition-all duration-500 group-hover:w-14 group-hover:bg-[#b8975a]" />
            {t("contactButton")}
          </Link>
        </div>
      </section>

    </main>
  );
}
