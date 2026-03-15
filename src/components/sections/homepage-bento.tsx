import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { CountUp } from "@/components/ui/count-up";

interface HomepageBentoProps {
  practiceAreas: { slug: string; title: string; description: string; icon: string }[];
  stats: { value: number; suffix: string; label: string }[];
}

export async function HomepageBento({ practiceAreas, stats }: HomepageBentoProps) {
  const t = await getTranslations("bentoGrid");

  return (
    <section className="bg-[#f5f5f3]" style={{ padding: "var(--section-py) var(--section-px)" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div style={{ marginBottom: "var(--space-2xl)" }}>
          <h2 className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-4xl)" }}>
            {t("headline")}
          </h2>
          <p className="text-[#666]" style={{ fontSize: "var(--fs-base)", marginTop: "var(--space-sm)", maxWidth: "36rem" }}>
            {t("subtext")}
          </p>
        </div>

        {/* Stats row */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 gap-px sm:grid-cols-3 border border-black/10" style={{ marginBottom: "var(--space-2xl)" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#f5f5f3] border-r border-black/10 last:border-r-0" style={{ padding: "var(--space-lg) var(--space-xl)" }}>
                <p className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-display)" }}>
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="tracking-widest uppercase text-[#888]" style={{ fontSize: "var(--fs-micro)", marginTop: "var(--space-xs)" }}>
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
                  href={`/hizmetlerimiz/${area.slug}`}
                  className="group bg-[#f5f5f3] flex flex-col transition-colors hover:bg-white"
                  style={{ padding: "var(--space-lg)", gap: "var(--space-sm)" }}
                >
                  <h3 className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-xl)" }}>
                    {area.title}
                  </h3>
                  {area.description && (
                    <p className="leading-relaxed text-[#666] line-clamp-3" style={{ fontSize: "var(--fs-sm)" }}>
                      {area.description}
                    </p>
                  )}
                  <span className="mt-auto tracking-widest uppercase text-[#aaa] transition-colors group-hover:text-[#1a1a1a]" style={{ fontSize: "var(--fs-micro)" }}>
                    {t("detail")} →
                  </span>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: "var(--space-xl)" }}>
              <Link
                href="/hizmetlerimiz"
                className="inline-flex items-center gap-3 tracking-[0.15em] uppercase text-[#1a1a1a] group"
                style={{ fontSize: "var(--fs-xs)" }}
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
