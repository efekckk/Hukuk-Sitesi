import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

interface HomepageBentoProps {
  practiceAreas: { slug: string; title: string; description: string; icon: string }[];
  stats: { value: number; suffix: string; label: string }[];
}

export async function HomepageBento({ practiceAreas, stats }: HomepageBentoProps) {
  const t = await getTranslations("bentoGrid");

  return (
    <section className="bg-[#f5f5f3] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="font-serif text-4xl font-light text-[#1a1a1a] lg:text-5xl">
            {t("headline")}
          </h2>
          <p className="mt-4 text-base text-[#666] max-w-xl">
            {t("subtext")}
          </p>
        </div>

        {/* Stats row */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 gap-px sm:grid-cols-3 border border-black/10 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#f5f5f3] px-8 py-10 border-r border-black/10 last:border-r-0">
                <p className="font-serif text-5xl font-light text-[#1a1a1a] lg:text-6xl">
                  {stat.value}{stat.suffix}
                </p>
                <p className="mt-2 text-xs tracking-widest uppercase text-[#888]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Practice areas grid */}
        {practiceAreas.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
              {practiceAreas.slice(0, 6).map((area) => (
                <Link
                  key={area.slug}
                  href={`/uzmanlik-alanlari/${area.slug}`}
                  className="group bg-[#f5f5f3] p-8 flex flex-col gap-4 transition-colors hover:bg-white"
                >
                  <h3 className="font-serif text-xl font-light text-[#1a1a1a]">
                    {area.title}
                  </h3>
                  {area.description && (
                    <p className="text-sm leading-relaxed text-[#666] line-clamp-3">
                      {area.description}
                    </p>
                  )}
                  <span className="mt-auto text-xs tracking-widest uppercase text-[#aaa] transition-colors group-hover:text-[#1a1a1a]">
                    {t("detail")} →
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-12">
              <Link
                href="/uzmanlik-alanlari"
                className="inline-flex items-center gap-3 text-sm tracking-[0.15em] uppercase text-[#1a1a1a] group"
              >
                <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
                {t("ctaButton")}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
