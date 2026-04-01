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

      {/* ── Team Layout ── */}
      <section className="mx-auto max-w-6xl" style={{ padding: "var(--space-3xl) var(--section-px) 0" }}>

        {/* Mobile: stack layout / Desktop: scatter layout */}
        {/* ── Mobile Layout (< md) ── */}
        <div className="md:hidden flex flex-col" style={{ gap: "var(--space-lg)" }}>
          <div className="grid grid-cols-3" style={{ gap: "var(--space-sm)" }}>
            {members.slice(0, 3).map((m) => (
              <div key={m.name} className="text-center">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="text-white/10" style={{ width: "2rem", height: "2rem" }} />
                    </div>
                  )}
                </div>
                <p className="font-serif font-light text-white/80 italic" style={{ fontSize: "clamp(0.7rem, 2.8vw, 0.95rem)", marginTop: "0.4rem" }}>
                  {isTr ? "Av." : "Atty."} {m.name}
                </p>
              </div>
            ))}
          </div>

          <p className="font-serif font-light italic text-white/70 leading-[1.35]" style={{ fontSize: "clamp(1.1rem, 4vw, 1.5rem)" }}>
            {quote}
          </p>
        </div>

        {/* ── Desktop Scatter Layout (>= md) ── */}
        <div className="hidden md:block relative" style={{ minHeight: "clamp(38rem, 58vw, 52rem)" }}>

          {/* Member 0 — sol üst */}
          {members[0] && (
            <div className="absolute z-10" style={{ top: "0", left: "0", width: "clamp(10rem, 22vw, 16rem)" }}>
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                {members[0].image ? (
                  <img src={members[0].image} alt={members[0].name} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User className="text-white/10" style={{ width: "3rem", height: "3rem" }} />
                  </div>
                )}
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <p className="font-serif font-light text-white/80 italic" style={{ fontSize: "var(--fs-lg)" }}>
                  {isTr ? "Av." : "Atty."} {members[0].name}
                </p>
              </div>
            </div>
          )}

          {/* Member 1 — sağ üst */}
          {members[1] && (
            <div className="absolute z-10" style={{ top: "0", right: "0", width: "clamp(10rem, 22vw, 16rem)" }}>
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                {members[1].image ? (
                  <img src={members[1].image} alt={members[1].name} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User className="text-white/10" style={{ width: "3rem", height: "3rem" }} />
                  </div>
                )}
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <p className="font-serif font-light text-white/80 italic" style={{ fontSize: "var(--fs-lg)" }}>
                  {isTr ? "Av." : "Atty."} {members[1].name}
                </p>
              </div>
            </div>
          )}

          {/* Quote — sol alt */}
          <p
            className="absolute font-serif font-light italic text-white/70 leading-[1.35]"
            style={{
              top: "clamp(17rem, 33vw, 25rem)",
              left: "0",
              fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
              maxWidth: "clamp(18rem, 50vw, 36rem)",
            }}
          >
            {quote}
          </p>

          {/* Member 2 — sağ alt */}
          {members[2] && (
            <div className="absolute z-10" style={{ bottom: "0", right: "clamp(2rem, 15vw, 12rem)", width: "clamp(10rem, 22vw, 16rem)" }}>
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]">
                {members[2].image ? (
                  <img src={members[2].image} alt={members[2].name} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User className="text-white/10" style={{ width: "3rem", height: "3rem" }} />
                  </div>
                )}
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <p className="font-serif font-light text-white/80 italic" style={{ fontSize: "var(--fs-lg)" }}>
                  {isTr ? "Av." : "Atty."} {members[2].name}
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── Typographic Logo ── */}
      <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center" style={{ marginBottom: "var(--space-2xl)" }}>
            <p className="font-serif font-light tracking-[0.15em] text-black" style={{ fontSize: "clamp(1.6rem, 5.5vw, 5rem)" }}>
              AŞCI{" "}<span className="hidden sm:inline">&nbsp;&nbsp;</span>ETCİ{" "}<span className="hidden sm:inline">&nbsp;&nbsp;</span>BENGLİAN
            </p>
            <p className="tracking-[0.4em] uppercase text-black/40" style={{ fontSize: "var(--fs-md)", marginTop: "var(--space-xs)" }}>
              {isTr ? "Avukatlık Ortaklığı" : "Law Partnership"}
            </p>
          </div>

          <div className="border-t border-black/15" />
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]" style={{ padding: "var(--space-2xl) 0", gap: "var(--space-xl)" }}>
            <p className="leading-[1.85] text-[#555]" style={{ fontSize: "var(--fs-base)" }}>
              {desc1}
            </p>
            <div className="hidden md:block bg-black/15" />
            <p className="leading-[1.85] text-[#555]" style={{ fontSize: "var(--fs-base)" }}>
              {desc2}
            </p>
          </div>
          <div className="border-b border-black/15" />
        </div>
      </section>

    </main>
  );
}
