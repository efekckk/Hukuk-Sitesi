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
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            {/* Left: text */}
            <div>
              <h1 className="font-serif text-5xl font-light text-[#1a1a1a] leading-tight">
                {t("title")}
              </h1>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-[#555]">
                {description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Right: photo placeholder */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e4de]">
              <img
                src="/images/team-meeting.jpg"
                alt="AEB Hukuk Ofisi"
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      {statsData.length > 0 && (
        <section className="bg-[#d0cdc9] py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {statsData.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-6xl font-light text-[#333] lg:text-7xl">
                    {stat.value}
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-xs tracking-widest uppercase text-[#666]">
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
