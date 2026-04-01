import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

interface FooterProps {
  locale?: string;
}

export async function Footer({ locale = "tr" }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const [dbAreas, contactSettings] = await Promise.all([
    prisma.practiceArea.findMany({
      orderBy: { order: "asc" },
      select: { slug: true, titleTr: true, titleEn: true },
    }),
    prisma.siteSetting.findMany({
      where: { group: "contact" },
    }),
  ]);

  const practiceAreas = dbAreas.map((a) => ({
    slug: a.slug,
    title: locale === "en" && a.titleEn ? a.titleEn : a.titleTr,
  }));

  const contactMap = Object.fromEntries(contactSettings.map((s) => [s.key, s.valueTr]));
  const phone = contactMap["phone"] || "+90 (212) 266 00 76";
  const phoneRaw = contactMap["phone_raw"] || "+902122660076";
  const email = contactMap["email"] || "info@aebhukuk.com";
  const address =
    contactMap["address"] ||
    "Merkez Mah,\nAbide-i Hürriyet Cad. İstiklal Sok.\nNo:11 Kat:3-4 Key Plaza\nŞişli / İstanbul";

  const isTr = locale !== "en";

  const pages = [
    { href: "/", label: isTr ? "Ana Sayfa" : "Home" },
    { href: "/hakkimizda", label: tNav("about") },
    { href: "/hizmetlerimiz", label: isTr ? "Hizmetlerimiz" : "Our Services" },
    { href: "/ekibimiz", label: tNav("team") },
    { href: "/blog", label: isTr ? "Yayınlar" : "Publications" },
    { href: "/sss", label: isTr ? "Sıkça S. Sorular" : "FAQ" },
    { href: "/iletisim", label: tNav("contact") },
    { href: "https://pos.param.com.tr/Tahsilat/Default.aspx?k=2524DFB2-A0F3-4A5A-B9DD-9A2A18B0E1BD", label: "E-Tahsilat", external: true },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white/50">
      {/* Üst çizgi */}
      <div className="border-t border-white/[0.08]" />

      {/* Main content */}
      <div className="mx-auto max-w-7xl" style={{ padding: "clamp(2.5rem, 4vw, 4rem) clamp(0.5rem, 1vw, 1rem)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 0 }}>

          {/* ── Col 1: Logo + description ── */}
          <div className="lg:border-r lg:border-white/[0.08]" style={{ paddingRight: "clamp(1.5rem, 2.5vw, 2.5rem)", paddingBottom: "2rem", paddingLeft: 0 }}>
            <Link href="/" className="inline-block" style={{ marginBottom: "clamp(1.25rem, 2vw, 1.75rem)" }}>
              <img src="/images/LOGO.webp" alt="AEB Avukatlık Ortaklığı" style={{ height: "clamp(2.5rem, 3.5vw, 3.5rem)", width: "auto" }} />
            </Link>
            <p className="leading-[1.75] text-white/40" style={{ fontSize: "var(--fs-sm)", marginBottom: "0.75rem" }}>
              {isTr
                ? "AEB Hukuk Bürosu, bireylerin ve kurumların haklarını en etkili şekilde savunmak amacıyla kurulmuş, dinamik ve vizyoner bir hukuk kuruluşudur."
                : "AEB Law Firm is a dynamic and visionary legal organization established to defend the rights of individuals and institutions in the most effective way."}
            </p>
            <p className="leading-[1.75] text-white/30" style={{ fontSize: "var(--fs-sm)" }}>
              {isTr
                ? "Yasal süreçlerin karmaşasında müvekkillerimizin yanında yer alarak, güven veren çözümler sunuyoruz."
                : "We stand by our clients through complex legal processes, offering trustworthy solutions."}
            </p>
          </div>

          {/* ── Col 2: Sayfalar ── */}
          <div className="lg:border-r lg:border-white/[0.08]" style={{ paddingLeft: "clamp(1.5rem, 2.5vw, 2.5rem)", paddingRight: "clamp(1.5rem, 2.5vw, 2.5rem)", paddingBottom: "2rem" }}>
            <h3 className="font-serif italic text-white/70" style={{ fontSize: "var(--fs-base)", marginBottom: "clamp(1rem, 1.5vw, 1.5rem)" }}>
              {isTr ? "Sayfalar" : "Pages"}
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {pages.map((item) => (
                <li key={item.href}>
                  {"external" in item ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="italic text-white/40 transition-colors hover:text-white" style={{ fontSize: "var(--fs-sm)" }}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="italic text-white/40 transition-colors hover:text-white" style={{ fontSize: "var(--fs-sm)" }}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Çalışma Alanları ── */}
          <div className="lg:border-r lg:border-white/[0.08]" style={{ paddingLeft: "clamp(1.5rem, 2.5vw, 2.5rem)", paddingRight: "clamp(1.5rem, 2.5vw, 2.5rem)", paddingBottom: "2rem" }}>
            <h3 className="font-serif italic text-white/70" style={{ fontSize: "var(--fs-base)", marginBottom: "clamp(1rem, 1.5vw, 1.5rem)" }}>
              {isTr ? "Çalışma Alanlarımız" : "Practice Areas"}
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {practiceAreas.map((area) => (
                <li key={area.slug}>
                  <Link href={`/hizmetlerimiz/${area.slug}`} className="italic text-white/40 transition-colors hover:text-white" style={{ fontSize: "var(--fs-sm)" }}>
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: İletişim ── */}
          <div style={{ paddingLeft: "clamp(1.5rem, 2.5vw, 2.5rem)", paddingBottom: "2rem" }}>
            <h3 className="font-serif italic text-white/70" style={{ fontSize: "var(--fs-base)", marginBottom: "0.5rem" }}>
              {isTr ? "Telefon" : "Phone"}
            </h3>
            <a href={`tel:${phoneRaw}`} className="italic text-white/40 hover:text-white transition-colors" style={{ fontSize: "var(--fs-sm)" }}>{phone}</a>

            <h3 className="font-serif italic text-white/70" style={{ fontSize: "var(--fs-base)", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Email</h3>
            <a href={`mailto:${email}`} className="italic text-white/40 hover:text-white transition-colors" style={{ fontSize: "var(--fs-sm)" }}>{email}</a>

            <h3 className="font-serif italic text-white/70" style={{ fontSize: "var(--fs-base)", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              {isTr ? "Adres" : "Address"}
            </h3>
            <p className="italic leading-[1.75] text-white/40 whitespace-pre-line" style={{ fontSize: "var(--fs-sm)" }}>{address}</p>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/[0.08]">
        <div className="mx-auto max-w-7xl" style={{ padding: "clamp(0.75rem, 1.2vw, 1.25rem) var(--section-px)" }}>
          <p className="text-center italic text-white/25" style={{ fontSize: "var(--fs-micro)" }}>
            {isTr
              ? "2026 - Bu internet sitesinde yer alan tüm bilgiler ve logoya ilişkin tüm fikri mülkiyet hakları AEB Avukatlık Ortaklığı'na aittir."
              : "2026 - All information and logos on this website are the intellectual property of AEB Law Partnership. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
