import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Users } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  image: string | null;
}

interface TeamCinematicProps {
  members: TeamMember[];
  locale?: string;
}

export async function TeamCinematic({ members, locale = "tr" }: TeamCinematicProps) {
  const t = await getTranslations({ locale, namespace: "team" });

  if (members.length === 0) return null;

  return (
    <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div style={{ marginBottom: "var(--space-2xl)" }}>
          <h2 className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-4xl)" }}>
            {t("title")}
          </h2>
          <p className="text-[#666]" style={{ fontSize: "var(--fs-base)", marginTop: "var(--space-sm)", maxWidth: "36rem" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {members.slice(0, 3).map((member) => (
            <div key={member.name} className="group relative aspect-[3/4] overflow-hidden bg-[#eee]">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "contrast(1.05) brightness(1.02)" }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Users className="text-black/10" style={{ width: "var(--fs-display)", height: "var(--fs-display)" }} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0" style={{ padding: "var(--space-lg)" }}>
                <p className="font-serif font-light text-white" style={{ fontSize: "var(--fs-xl)" }}>{member.name}</p>
                <p className="tracking-widest uppercase text-white/60" style={{ fontSize: "var(--fs-micro)", marginTop: "0.3em" }}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "var(--space-xl)" }}>
          <Link
            href="/ekibimiz"
            className="inline-flex items-center gap-3 tracking-[0.15em] uppercase text-[#1a1a1a] group"
            style={{ fontSize: "var(--fs-xs)" }}
          >
            <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
