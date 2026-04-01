import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { User } from "lucide-react";
import { TeamSearch } from "@/components/team-search";

interface TeamPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;
  const t = await getTranslations("team");
  const isTr = locale !== "en";

  const dbMembers = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  // Ortaklar (görselleriyle sayfada görünür)
  const partners = dbMembers.filter((m) => m.isPartner);
  const members = partners.map((m) => ({
    name: locale === "en" && m.nameEn ? m.nameEn : m.nameTr,
    role: locale === "en" && m.roleEn ? m.roleEn : m.roleTr,
    specialty: locale === "en" && m.specialtyEn ? m.specialtyEn : m.specialtyTr,
    image: m.image,
  }));

  // Tüm ekip (modal için)
  const allNames = dbMembers.map((m) =>
    locale === "en" && m.nameEn ? m.nameEn : m.nameTr
  );

  const quote = isTr
    ? "Deneyimli ve koordineli ekibimiz, müvekkillerimizin ihtiyaç duyduğu en karmaşık hukuki süreçleri çözüm odaklı bir anlayışla yönetir."
    : "Our experienced and coordinated team manages the most complex legal processes with a solution-oriented approach.";

  const desc1 = isTr
    ? "AEB Hukuk, farklı uzmanlık alanlarında faaliyet gösteren avukatları ve destek birimleriyle birlikte 70 kişilik güçlü bir ekibe sahiptir. Bu geniş ve deneyimli kadro, müvekkillerimizin ihtiyaç duyduğu hukuki süreçleri etkin ve koordineli bir şekilde yönetmemizi sağlar."
    : "AEB Law has a strong team of 70 people, including lawyers and support units operating in different areas of expertise. This large and experienced staff enables us to manage the legal processes our clients need effectively and in a coordinated manner.";

  const desc2 = isTr
    ? "Ekip yapımız; ticaret hukuku, uyuşmazlık çözümü, kurumsal danışmanlık ve farklı uzmanlık alanlarında derin deneyime sahip profesyonellerden oluşmaktadır. Her dosya, disiplinli analiz ve güçlü bir iş birliği anlayışıyla ele alınarak müvekkillerimize kapsamlı ve sürdürülebilir çözümler sunulmaktadır."
    : "Our team structure consists of professionals with deep experience in commercial law, dispute resolution, corporate advisory and various areas of expertise. Each case is handled with disciplined analysis and a strong collaborative approach to provide comprehensive and sustainable solutions to our clients.";

  return (
    <main className="bg-[#0a0a0a]">

      {/* ── Fixed Floating Search Button — sol alt ── */}
      <div className="fixed z-40" style={{ bottom: "clamp(1.5rem, 3vw, 2.5rem)", left: "clamp(1.5rem, 3vw, 2.5rem)" }}>
        <TeamSearch locale={locale} members={allNames} />
      </div>

      {/* ── Typographic Logo ── */}
      <section style={{ padding: "var(--space-3xl) var(--section-px) 0" }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center border-b border-white/[0.08]" style={{ paddingBottom: "var(--space-xl)" }}>
            <p className="font-serif font-light tracking-[0.15em] text-white" style={{ fontSize: "clamp(1.6rem, 5.5vw, 5rem)" }}>
              AŞCI{" "}<span className="hidden sm:inline">&nbsp;&nbsp;</span>ETCİ{" "}<span className="hidden sm:inline">&nbsp;&nbsp;</span>BENGLİAN
            </p>
            <p className="tracking-[0.4em] uppercase text-white/30" style={{ fontSize: "var(--fs-md)", marginTop: "var(--space-xs)" }}>
              {isTr ? "Avukatlık Ortaklığı" : "Law Partnership"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Team Grid — 3 fotoğraf yan yana ── */}
      <section className="mx-auto max-w-6xl" style={{ padding: "var(--space-lg) var(--section-px) var(--space-xl)" }}>
        <p className="tracking-[0.3em] uppercase text-white/30 text-center" style={{ fontSize: "var(--fs-sm)", marginBottom: "var(--space-md)" }}>
          {isTr ? "Kurucu Ortaklarımız" : "Our Founding Partners"}
        </p>
        <div className="grid grid-cols-3" style={{ gap: "clamp(0.75rem, 2vw, 2rem)" }}>
          {members.slice(0, 3).map((m) => (
            <div key={m.name}>
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User className="text-white/10" style={{ width: "clamp(2rem, 4vw, 3rem)", height: "clamp(2rem, 4vw, 3rem)" }} />
                  </div>
                )}
              </div>
              <p className="font-serif font-light text-white/80 italic text-center" style={{ fontSize: "clamp(0.7rem, 2vw, 1.25rem)", marginTop: "clamp(0.5rem, 1vw, 0.75rem)" }}>
                {isTr ? "Av." : "Atty."} {m.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Açıklamalar ── */}
      <section className="mx-auto max-w-6xl" style={{ padding: "var(--space-xl) var(--section-px) var(--section-py)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]" style={{ gap: "var(--space-xl)" }}>
          <p className="leading-[1.85] text-white/50" style={{ fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)" }}>
            {desc1}
          </p>
          <div className="hidden md:block bg-white/10" />
          <p className="leading-[1.85] text-white/50" style={{ fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)" }}>
            {desc2}
          </p>
        </div>
      </section>

    </main>
  );
}
