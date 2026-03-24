import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const slugToKey: Record<string, string> = {
  "ceza-hukuku": "criminal",
  "aile-hukuku": "family",
  "is-hukuku": "labor",
  "ticaret-hukuku": "commercial",
  "idare-hukuku": "administrative",
  "gayrimenkul-hukuku": "realEstate",
};



interface PracticeAreaDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const areas = await prisma.practiceArea.findMany({ select: { slug: true } });
    if (areas.length > 0) return areas.map((a) => ({ slug: a.slug }));
  } catch { /* DB not available at build time */ }
  return Object.keys(slugToKey).map((slug) => ({ slug }));
}

export default async function PracticeAreaDetailPage({ params }: PracticeAreaDetailPageProps) {
  const { locale, slug } = await params;
  const tp = await getTranslations("practiceAreas");
  const isTr = locale !== "en";

  // Ana alan
  const dbArea = await prisma.practiceArea.findUnique({ where: { slug } });
  if (!dbArea) {
    const key = slugToKey[slug];
    if (!key) notFound();
  }

  // Tüm alanlar — related cards için
  const allAreas = await prisma.practiceArea.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, titleTr: true, titleEn: true, descriptionTr: true, descriptionEn: true, order: true, image: true },
  });

  // İletişim bilgileri
  const contactSettings = await prisma.siteSetting.findMany({ where: { group: "contact" } });
  const cm = Object.fromEntries(contactSettings.map((s) => [s.key, s]));
  const phone = cm.phone?.valueTr || "+90 (212) 266 00 76";
  const phoneRaw = cm.phone_raw?.valueTr || "+902122660076";
  const email = cm.email?.valueTr || "info@aebhukuk.com";
  const address = (isTr ? cm.address?.valueTr : cm.address?.valueEn) || cm.address?.valueTr || "KEY Plaza, Şişli / İstanbul";
  const hours = (isTr ? cm.working_hours?.valueTr : cm.working_hours?.valueEn) || "Hafta içi 09:00 – 18:00";

  if (!dbArea) notFound();

  const title = isTr ? dbArea.titleTr : (dbArea.titleEn || dbArea.titleTr);
  const longDesc = isTr ? dbArea.longDescTr : (dbArea.longDescEn || dbArea.longDescTr);
  const itemsRaw = isTr ? dbArea.itemsTr : (dbArea.itemsEn || dbArea.itemsTr);
  const items = itemsRaw.split("\n").filter((l) => l.trim() !== "");

  // Related: mevcut hariç 3 farklı alan (sıradaki 3)
  const currentIndex = allAreas.findIndex((a) => a.slug === slug);
  const related = allAreas
    .filter((a) => a.slug !== slug)
    .slice(currentIndex % Math.max(allAreas.length - 1, 1), currentIndex % Math.max(allAreas.length - 1, 1) + 3)
    .concat(allAreas.filter((a) => a.slug !== slug))
    .slice(0, 3);

  return (
    <main className="bg-white">

      {/* ── Hero band ── */}
      <div className="bg-[#0a0a0a]" style={{ paddingTop: "clamp(5rem, 8vw, 9rem)", paddingBottom: "var(--space-2xl)", paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)" }}>
        <div className="mx-auto max-w-7xl">
          <Link
            href="/hizmetlerimiz"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors mb-8"
            style={{ fontSize: "0.6875rem" }}
          >
            ← {tp("title")}
          </Link>
          <h1
            className="font-serif font-light text-white leading-[1.05]"
            style={{ fontSize: "var(--fs-3xl)", maxWidth: "32rem" }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* ── Ana içerik ── */}
      <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]" style={{ gap: "var(--space-2xl)", alignItems: "start" }}>

          {/* Sol — metin */}
          <div>
            {/* Başlık */}
            <h2
              className="font-serif font-light text-[#1a1a1a] leading-snug"
              style={{ fontSize: "var(--fs-3xl)", marginBottom: "var(--space-xl)" }}
            >
              {title}{isTr ? " Nedir?" : " – What is it?"}
            </h2>

            {/* Uzun açıklama */}
            <div
              className="text-[#444] leading-[1.9]"
              style={{ fontSize: "var(--fs-base)" }}
            >
              {longDesc.split("\n\n").map((para, i) => (
                <p key={i} style={{ marginBottom: "var(--space-md)" }}>{para}</p>
              ))}
            </div>

            {/* Hizmet kalemleri */}
            {items.length > 0 && (
              <div style={{ marginTop: "var(--space-2xl)" }}>
                <h3
                  className="font-serif font-light text-[#1a1a1a]"
                  style={{ fontSize: "var(--fs-xl)", marginBottom: "var(--space-lg)" }}
                >
                  {tp("ourServices")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center border-b border-[#e8e4de]"
                      style={{ gap: "var(--space-sm)", padding: "var(--space-md) var(--space-xs)" }}
                    >
                      <span className="text-[#b8975a] shrink-0" style={{ fontSize: "0.8125rem" }}>—</span>
                      <span className="text-[#444]" style={{ fontSize: "0.875rem" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sağ — sticky iletişim kartı */}
          <div className="lg:sticky" style={{ top: "clamp(5rem,6vw,7rem)" }}>
            <div className="bg-[#111] text-white" style={{ padding: "var(--space-xl)" }}>

              <h3
                className="font-serif font-light text-white leading-snug"
                style={{ fontSize: "var(--fs-xl)", marginBottom: "0.6em" }}
              >
                {isTr ? "Size Nasıl Yardımcı Olabiliriz?" : "How Can We Help You?"}
              </h3>
              <p
                className="text-white/45 leading-relaxed"
                style={{ fontSize: "1rem", marginBottom: "var(--space-lg)" }}
              >
                {isTr
                  ? "Hukuki süreçleriniz için bizimle iletişime geçebilirsiniz."
                  : "Contact us for your legal processes."}
              </p>

              {/* İletişim satırları */}
              <div               style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  {
                    icon: Phone,
                    label: isTr ? "TELEFON" : "PHONE",
                    content: <a href={`tel:${phoneRaw}`} className="text-white hover:text-[#b8975a] transition-colors">{phone}</a>,
                  },
                  {
                    icon: Mail,
                    label: "MAİL",
                    content: <a href={`mailto:${email}`} className="text-white hover:text-[#b8975a] transition-colors break-all">{email}</a>,
                  },
                  {
                    icon: MapPin,
                    label: isTr ? "ADRES" : "ADDRESS",
                    content: <span className="text-white">KEY Plaza, İstiklal Sok. No:11 K:3-4, Şişli / İstanbul</span>,
                  },
                  {
                    icon: Clock,
                    label: isTr ? "ÇALIŞMA SAATLERİ" : "WORKING HOURS",
                    content: <span className="text-white">{isTr ? "Pazartesi – Cuma: 09:00 – 18:00" : "Mon – Fri: 09:00 – 18:00"}</span>,
                  },
                ].map(({ icon: Icon, label, content }, i, arr) => (
                  <div
                    key={label}
                    className="flex items-start"
                    style={{
                      gap: "0.75rem",
                      paddingBottom: "1rem",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    }}
                  >
                    <Icon className="text-[#b8975a] shrink-0 mt-0.5" style={{ width: "1rem", height: "1rem" }} />
                    <div>
                      <p className="text-white/30 uppercase tracking-widest" style={{ fontSize: "0.6875rem", marginBottom: "0.2em" }}>
                        {label}
                      </p>
                      <div style={{ fontSize: "1rem", lineHeight: 1.5 }}>
                        {content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-white/20 italic" style={{ fontSize: "0.6875rem", marginTop: "var(--space-md)" }}>
                {isTr ? "*Hafta içi 09:00 – 18:00 arası hizmete açıktır." : "*Available weekdays 09:00 – 18:00."}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── İlgili Hizmetler ── */}
      {related.length > 0 && (
        <section className="bg-[#f5f5f3]" style={{ padding: "var(--section-py) var(--section-px)" }}>
          <div className="mx-auto max-w-7xl">
            <p
              className="tracking-[0.35em] uppercase text-[#999]"
              style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-2xl)" }}
            >
              {isTr ? "DİĞER HİZMETLERİMİZ" : "OTHER SERVICES"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "clamp(0.5rem, 0.8vw, 1rem)" }}>
              {related.map((area, i) => {
                  const img = area.image ?? null;
                const areaTitle = isTr ? area.titleTr : (area.titleEn || area.titleTr);
                const areaDesc = isTr ? area.descriptionTr : (area.descriptionEn || area.descriptionTr);

                return (
                  <Link
                    key={area.slug}
                    href={`/hizmetlerimiz/${area.slug}`}
                    className="group relative overflow-hidden bg-[#1c1c1c] flex flex-col justify-end"
                    style={{ aspectRatio: "4/3" }}
                  >
                    {img && (
                      <img
                        src={img}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        style={{ filter: "grayscale(50%) brightness(0.35)" }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="relative z-10" style={{ padding: "var(--space-lg)" }}>
                      <h3
                        className="font-serif font-light text-white leading-snug group-hover:text-[#b8975a] transition-colors"
                        style={{ fontSize: "var(--fs-xl)" }}
                      >
                        {areaTitle}
                      </h3>
                      {areaDesc && (
                        <p
                          className="text-white/40 line-clamp-2 leading-relaxed"
                          style={{ fontSize: "var(--fs-xs)", marginTop: "var(--space-xs)" }}
                        >
                          {areaDesc}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
