import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { TeamPageClient } from "./team-page-client";
import { PageHero } from "@/components/sections/page-hero";

interface TeamPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;
  const t = await getTranslations("team");
  const tp = await getTranslations("teamPage");

  const dbMembers = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  const members = dbMembers.map((m) => ({
    name: (locale === "en" && m.nameEn) ? m.nameEn : m.nameTr,
    role: (locale === "en" && m.roleEn) ? m.roleEn : m.roleTr,
    specialty: (locale === "en" && m.specialtyEn) ? m.specialtyEn : m.specialtyTr,
    image: m.image,
  }));

  return (
    <main>
      {/* Hero Section */}
      <PageHero title={t("title")} subtitle={t("subtitle")} backgroundImage="/images/cinematic/metaphor-bridge.jpg" />

      {/* Description */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-white/60 leading-relaxed text-center">
            {tp("description")}
          </p>
        </div>
      </section>

      {/* Team Grid with Filtering */}
      <section className="pb-20 relative">
        <div className="container mx-auto px-4">
          <TeamPageClient
            members={members}
            allLabel={locale === "en" ? "All" : "Tümü"}
          />
        </div>
      </section>
    </main>
  );
}
