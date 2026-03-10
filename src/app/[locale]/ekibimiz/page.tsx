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
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-16">
        <div className="flex items-end justify-between border-b border-white/10 pb-8">
          <h1 className="font-serif text-5xl font-light text-white lg:text-6xl">
            {t("title")}
          </h1>
          <p className="hidden max-w-xs text-sm leading-relaxed text-white/40 md:block">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Team — asymmetric layout */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div
              key={member.name}
              className="group relative"
              style={{
                marginTop: index % 3 === 1 ? "4rem" : index % 3 === 2 ? "8rem" : "0",
              }}
            >
              {/* Photo */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover grayscale"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User className="h-16 w-16 text-white/10" />
                  </div>
                )}
              </div>

              {/* Name / role */}
              <div className="mt-4 px-1">
                <p className="text-xs tracking-widest uppercase text-white/30">
                  {member.role}
                </p>
                <h3 className="mt-1 font-serif text-xl font-light text-white">
                  {member.name}
                </h3>
                {member.specialty && (
                  <p className="mt-1 text-xs text-white/30">{member.specialty}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote section */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-serif text-3xl font-light leading-relaxed text-white/70 lg:text-4xl xl:text-5xl max-w-5xl">
            Deneyimli ve koordineli ekibimiz, müvekkillerimizin ihtiyaç duyduğu
            en karmaşık hukuki süreçleri çözüm odaklı bir anlayışla yönetir.
          </p>
        </div>
      </section>

      {/* Large typographic logo + two-column description */}
      <section className="border-t border-white/5 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="font-serif text-5xl font-light tracking-widest text-black lg:text-7xl xl:text-8xl">
              AŞÇI&nbsp;&nbsp;ETÇİ&nbsp;&nbsp;BENGLİAN
            </p>
            <p className="mt-4 text-xs tracking-[0.4em] uppercase text-black/30">
              Avukatlık Ortaklığı
            </p>
          </div>

          {/* Two-column description */}
          <div className="mt-16 grid grid-cols-1 gap-12 border-t border-black/10 pt-16 md:grid-cols-2 md:gap-20">
            <p className="text-sm leading-relaxed text-[#555]">
              Aşçı Etci Benglian Avukatlık Ortaklığı, bütün hukuki alanlarda, uzmanlık ve deneyimi bir araya getiren bağımsız bir avukatlık bürosudur.
              <br /><br />
              AEB Avukatlık Bürosu olarak özel kişilerden, orta ve büyük ölçekli şirketlere, devlet kuruluşlarından uluslararası ve küresel holdinglere kadar herkesin hukuki ihtiyaçlarına yönelik hizmet vermekteyiz.
            </p>
            <p className="text-sm leading-relaxed text-[#555]">
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
