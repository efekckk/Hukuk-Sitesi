import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { CountUp } from "@/components/ui/count-up";
import { GlowDivider } from "@/components/glow-divider";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations("about");
  const isTr = locale !== "en";

  const [aboutSettings, statsSettings] = await Promise.all([
    prisma.siteSetting.findMany({ where: { group: "about" } }),
    prisma.siteSetting.findMany({ where: { group: "stats" } }),
  ]);

  const aboutMap = Object.fromEntries(aboutSettings.map((s) => [s.key, s]));
  const description =
    locale === "en" && aboutMap.about_description?.valueEn
      ? aboutMap.about_description.valueEn
      : aboutMap.about_description?.valueTr || t("description");

  const statsMap = Object.fromEntries(statsSettings.map((s) => [s.key, s]));
  const statsData = ["experience", "cases", "clients"]
    .map((key) => {
      const valueSetting = statsMap[`stat_${key}_value`];
      const suffixSetting = statsMap[`stat_${key}_suffix`];
      const labelSetting = statsMap[`stat_${key}_label`];
      if (!valueSetting) return null;
      return {
        value: Number(valueSetting.valueTr) || 0,
        suffix: suffixSetting?.valueTr || "+",
        label: locale === "en" && labelSetting?.valueEn ? labelSetting.valueEn : labelSetting?.valueTr || "",
      };
    })
    .filter(Boolean) as { value: number; suffix: string; label: string }[];

  const valueKeys = ["integrity", "expertise", "dedication"] as const;

  return (
    <main>

      {/* ── Section 1: Hero Banner ── */}
      <div className="relative bg-[#0a0a0a] overflow-hidden flex items-end" style={{ minHeight: "clamp(18rem, 40vh, 28rem)", paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)", paddingBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="/images/services-hero.webp"
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: "grayscale(30%) brightness(0.4)" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <h1
            className="font-serif font-light text-white leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", marginBottom: "0.75rem" }}
          >
            {t("heroTitle")}
          </h1>
          <nav className="text-white/35" style={{ fontSize: "var(--fs-micro)" }}>
            <Link href="/" className="hover:text-white/60 transition-colors">{isTr ? "Anasayfa" : "Home"}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white/50">{t("title")}</span>
          </nav>
        </div>
      </div>

      {/* ── Section 2: Hikaye / Tanıtım ── */}
      <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center lg:grid-cols-2" style={{ gap: "var(--space-2xl)" }}>
            <div>
              <p className="tracking-[0.3em] uppercase text-[#b8975a]" style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-lg)" }}>
                {t("tagline")}
              </p>
              <h2 className="font-serif font-light text-[#1a1a1a] leading-tight" style={{ fontSize: "var(--fs-3xl)", marginBottom: "var(--space-lg)" }}>
                {t("storyTitle")}
              </h2>
              <div className="leading-[1.9] text-[#555]" style={{ fontSize: "var(--fs-base)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
              <img
                src="/images/about-building.webp"
                alt="AEB Hukuk Ofisi"
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(15%) brightness(0.7)" }}
              />
              <div className="absolute inset-5 border border-white/[0.08] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* ── Section 3: Değerlerimiz ── */}
      <section className="bg-[#f5f5f3]" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="tracking-[0.35em] uppercase text-black/30" style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-xs)" }}>
            {t("values.title")}
          </p>
          <h2 className="font-serif font-light text-[#1a1a1a] leading-tight" style={{ fontSize: "var(--fs-3xl)", marginBottom: "var(--space-2xl)" }}>
            {isTr ? "İlkelerimiz" : "Our Principles"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "clamp(1rem, 2vw, 2rem)" }}>
            {valueKeys.map((key) => (
              <div key={key} className="relative bg-white overflow-hidden" style={{ padding: "var(--space-xl)" }}>
                <div className="absolute left-0 top-0 w-1 h-full bg-[#b8975a]/30" />
                <h3 className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-xl)" }}>
                  {t(`values.${key}.title`)}
                </h3>
                <p className="leading-[1.8] text-[#666]" style={{ fontSize: "var(--fs-sm)", marginTop: "var(--space-sm)" }}>
                  {t(`values.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* ── Section 5: Vizyon & Misyon ── */}
      <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
            {/* Vizyon */}
            <div className="border-b md:border-b-0 md:border-r border-black/10" style={{ padding: "var(--space-xl)" }}>
              <h3 className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--space-md)" }}>
                {t("vision.title")}
              </h3>
              <p className="leading-[1.9] text-[#555]" style={{ fontSize: "var(--fs-base)" }}>
                {t("vision.description")}
              </p>
            </div>
            {/* Misyon */}
            <div style={{ padding: "var(--space-xl)" }}>
              <h3 className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--space-md)" }}>
                {t("mission.title")}
              </h3>
              <p className="leading-[1.9] text-[#555]" style={{ fontSize: "var(--fs-base)" }}>
                {t("mission.description")}
              </p>
            </div>
          </div>
        </div>
      </section>




    </main>
  );
}
