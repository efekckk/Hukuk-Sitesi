import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { User } from "lucide-react";

interface TeamPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;
  const t = await getTranslations("team");

  const dbMembers = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  const members = dbMembers.map((m) => ({
    name: locale === "en" && m.nameEn ? m.nameEn : m.nameTr,
    role: locale === "en" && m.roleEn ? m.roleEn : m.roleTr,
    specialty: locale === "en" && m.specialtyEn ? m.specialtyEn : m.specialtyTr,
    image: m.image,
  }));

  return (
    <main className="bg-[#0a0a0a]">
      {/* Header */}
      <section className="mx-auto max-w-7xl" style={{ padding: "var(--space-3xl) var(--section-px) var(--space-xl)" }}>
        <div className="flex items-end justify-between border-b border-white/10" style={{ paddingBottom: "var(--space-lg)" }}>
          <h1 className="font-serif font-light text-white" style={{ fontSize: "var(--fs-5xl)" }}>
            {t("title")}
          </h1>
          <p className="hidden md:block text-white/40" style={{ fontSize: "var(--fs-sm)", maxWidth: "18rem", lineHeight: "1.7" }}>
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="mx-auto max-w-7xl" style={{ padding: "0 var(--section-px) var(--space-3xl)" }}>
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div
              key={member.name}
              className="group relative"
              style={{ marginTop: index % 3 === 1 ? "clamp(2rem,4vw,6rem)" : index % 3 === 2 ? "clamp(4rem,8vw,10rem)" : "0" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-top"
                    style={{
                      filter: "contrast(1.05) brightness(1.02)",
                      imageRendering: "auto",
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User className="text-white/10" style={{ width: "var(--fs-display)", height: "var(--fs-display)" }} />
                  </div>
                )}
              </div>
              <div style={{ marginTop: "var(--space-sm)", padding: "0 var(--space-xs)" }}>
                <p className="tracking-widest uppercase text-white/30" style={{ fontSize: "var(--fs-micro)" }}>{member.role}</p>
                <h3 className="font-serif font-light text-white" style={{ fontSize: "var(--fs-3xl)", marginTop: "0.2em" }}>{member.name}</h3>
                {member.specialty && (
                  <p className="text-white/30" style={{ fontSize: "var(--fs-xs)", marginTop: "0.2em" }}>{member.specialty}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote section */}
      <section className="border-t border-white/10" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="font-serif font-light leading-relaxed text-white/70" style={{ fontSize: "var(--fs-5xl)", maxWidth: "48rem" }}>
            Deneyimli ve koordineli ekibimiz, müvekkillerimizin ihtiyaç duyduğu
            en karmaşık hukuki süreçleri çözüm odaklı bir anlayışla yönetir.
          </p>
        </div>
      </section>

      {/* Typographic logo */}
      <section className="border-t border-white/5 bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-serif font-light tracking-widest text-black" style={{ fontSize: "var(--fs-display)" }}>
              AŞÇI&nbsp;&nbsp;ETÇİ&nbsp;&nbsp;BENGLİAN
            </p>
            <p className="tracking-[0.4em] uppercase text-black/30" style={{ fontSize: "var(--fs-4xl)", marginTop: "var(--space-sm)" }}>
              Avukatlık Ortaklığı
            </p>
          </div>

          <div className="grid grid-cols-1 border-t border-black/10 md:grid-cols-2" style={{ marginTop: "var(--space-2xl)", paddingTop: "var(--space-2xl)", gap: "var(--space-xl)" }}>
            <p className="leading-relaxed text-[#555]" style={{ fontSize: "var(--fs-2xl)" }}>
              Aşçı Etci Benglian Avukatlık Ortaklığı, bütün hukuki alanlarda, uzmanlık ve deneyimi bir araya getiren bağımsız bir avukatlık bürosudur.
              <br /><br />
              AEB Avukatlık Bürosu olarak özel kişilerden, orta ve büyük ölçekli şirketlere, devlet kuruluşlarından uluslararası ve küresel holdinglere kadar herkesin hukuki ihtiyaçlarına yönelik hizmet vermekteyiz.
            </p>
            <p className="leading-relaxed text-[#555]" style={{ fontSize: "var(--fs-2xl)" }}>
              Aşçı Etci Benglian Avukatlık Ortaklığı, bütün hukuki alanlarda, uzmanlık ve deneyimi bir araya getiren bağımsız bir avukatlık bürosudur.
              <br /><br />
              AEB Avukatlık Bürosu olarak özel kişilerden, orta ve büyük ölçekli şirketlere, devlet kuruluşlarından uluslararası ve küresel holdinglere kadar herkesin hukuki ihtiyaçlarına yönelik hizmet vermekteyiz.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
