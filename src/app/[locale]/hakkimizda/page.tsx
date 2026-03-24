import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations("about");

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
        value: valueSetting.valueTr || "0",
        suffix: suffixSetting?.valueTr || "+",
        label:
          locale === "en" && labelSetting?.valueEn
            ? labelSetting.valueEn
            : labelSetting?.valueTr || "",
      };
    })
    .filter(Boolean) as { value: string; suffix: string; label: string }[];

  return (
    <main>
      {/* About — two-column section */}
      <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start lg:grid-cols-2" style={{ gap: "var(--space-2xl)" }}>
            <div>
              <h1 className="font-serif font-light text-[#1a1a1a] leading-tight" style={{ fontSize: "var(--fs-3xl)" }}>
                {t("title")}
              </h1>
              <div className="leading-relaxed text-[#555]" style={{ fontSize: "var(--fs-base)", marginTop: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e4de]">
              <img src="/images/businessmen-investors-shake-hands-with-lawyers-to-2026-01-08-02-27-24-utc.jpg.webp" alt="AEB Hukuk Ofisi" className="h-full w-full object-cover grayscale" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      {statsData.length > 0 && (
        <section className="bg-[#d0cdc9]" style={{ padding: "var(--space-2xl) var(--section-px)" }}>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "var(--space-xl)" }}>
              {statsData.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif font-light text-[#333]" style={{ fontSize: "var(--fs-4xl)" }}>
                    {stat.value}{stat.suffix}
                  </p>
                  <p className="tracking-widest uppercase text-[#666]" style={{ fontSize: "var(--fs-micro)", marginTop: "var(--space-xs)" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
