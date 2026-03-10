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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="font-serif text-4xl font-light text-[#1a1a1a] lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base text-[#666] max-w-xl">
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
                  className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Users className="w-16 h-16 text-black/10" />
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="font-serif text-xl font-light text-white">{member.name}</p>
                <p className="mt-1 text-xs tracking-widest uppercase text-white/60">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Link to full team page */}
        <div className="mt-12">
          <Link
            href="/ekibimiz"
            className="inline-flex items-center gap-3 text-sm tracking-[0.15em] uppercase text-[#1a1a1a] group"
          >
            <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
