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
    "AEB Hukuk\nKEY Plaza, Merkez, İstiklal Sokağı\nNo:11 K:3-4, 34384\nŞişli / İstanbul";

  const isTr = locale !== "en";

  const pages = [
    { href: "/", label: isTr ? "Ana Sayfa" : "Home" },
    { href: "/hakkimizda", label: tNav("about") },
    { href: "/hizmetlerimiz", label: isTr ? "Hizmetlerimiz" : "Our Services" },
    { href: "/ekibimiz", label: tNav("team") },
    { href: "/blog", label: isTr ? "Yayınlar" : "Publications" },
    { href: "/sss", label: isTr ? "Sıkça S. Sorular" : "FAQ" },
    { href: "/iletisim", label: tNav("contact") },
  ];

  return (
    <footer className="bg-[#111110] text-white/50">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl" style={{ padding: "var(--space-2xl) var(--section-px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1px_1fr_1px_1fr_1px_1.1fr] gap-0">

          {/* ── Col 1: Logo + description ── */}
          <div className="pb-12 lg:pb-0" style={{ paddingRight: "var(--space-xl)" }}>
            <Link href="/" className="inline-block" style={{ marginBottom: "var(--space-lg)" }}>
              <img src="/images/LOGO.webp" alt="AEB Avukatlık Ortaklığı" style={{ height: "clamp(2.5rem, 3.5vw, 4rem)", width: "auto" }} />
            </Link>
            <p className="leading-relaxed text-white/45" style={{ fontSize: "var(--fs-sm)", marginBottom: "var(--space-sm)" }}>
              {t("description")}
            </p>
            <p className="leading-relaxed text-white/35" style={{ fontSize: "var(--fs-sm)" }}>
              {isTr
                ? "Yasal süreçlerin karmaşasında müvekkillerimizin yanında yer alarak, güven veren çözümler sunuyoruz."
                : "We stand by our clients through complex legal processes, offering trustworthy solutions."}
            </p>
          </div>

          <div className="hidden lg:block bg-white/[0.07]" style={{ margin: "0 var(--space-lg)" }} />

          {/* ── Col 2: Pages ── */}
          <div className="pb-12 lg:pb-0" style={{ paddingRight: "var(--space-lg)" }}>
            <h3 className="font-['Cormorant_Garamond'] font-semibold italic text-white/70" style={{ fontSize: "var(--fs-base)", marginBottom: "var(--space-md)" }}>
              {isTr ? "Sayfalar" : "Pages"}
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              {pages.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="italic text-white/45 transition-colors hover:text-white" style={{ fontSize: "var(--fs-sm)" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://pos.param.com.tr/Tahsilat/Default.aspx?k=2524DFB2-A0F3-4A5A-B9DD-9A2A18B0E1BD" target="_blank" rel="noopener noreferrer" className="italic text-white/45 transition-colors hover:text-white" style={{ fontSize: "var(--fs-sm)" }}>
                  E-Tahsilat
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden lg:block bg-white/[0.07]" style={{ margin: "0 var(--space-lg)" }} />

          {/* ── Col 3: Practice Areas ── */}
          <div className="pb-12 lg:pb-0" style={{ paddingRight: "var(--space-lg)" }}>
            <h3 className="font-['Cormorant_Garamond'] font-semibold italic text-white/70" style={{ fontSize: "var(--fs-base)", marginBottom: "var(--space-md)" }}>
              {isTr ? "Çalışma Alanlarımız" : "Practice Areas"}
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              {practiceAreas.map((area) => (
                <li key={area.slug}>
                  <Link href={`/hizmetlerimiz/${area.slug}`} className="italic text-white/45 transition-colors hover:text-white" style={{ fontSize: "var(--fs-sm)" }}>
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block bg-white/[0.07]" style={{ margin: "0 var(--space-lg)" }} />

          {/* ── Col 4: Contact ── */}
          <div>
            <h3 className="font-['Cormorant_Garamond'] font-semibold italic text-white/70" style={{ fontSize: "var(--fs-base)", marginBottom: "var(--space-xs)" }}>
              {isTr ? "Telefon" : "Phone"}
            </h3>
            <a href={`tel:${phoneRaw}`} className="text-white/45 hover:text-white transition-colors" style={{ fontSize: "var(--fs-sm)" }}>{phone}</a>

            <h3 className="font-['Cormorant_Garamond'] font-semibold italic text-white/70" style={{ fontSize: "var(--fs-base)", marginTop: "var(--space-lg)", marginBottom: "var(--space-xs)" }}>Email</h3>
            <a href={`mailto:${email}`} className="text-white/45 hover:text-white transition-colors" style={{ fontSize: "var(--fs-sm)" }}>{email}</a>

            <h3 className="font-['Cormorant_Garamond'] font-semibold italic text-white/70" style={{ fontSize: "var(--fs-base)", marginTop: "var(--space-lg)", marginBottom: "var(--space-xs)" }}>
              {isTr ? "Adres" : "Address"}
            </h3>
            <p className="leading-relaxed text-white/45 whitespace-pre-line" style={{ fontSize: "var(--fs-sm)" }}>{address}</p>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl" style={{ padding: "var(--space-sm) var(--section-px)" }}>
          <p className="text-center italic text-white/25" style={{ fontSize: "var(--fs-micro)" }}>
            2025 - Bu internet sitesinde yer alan tüm bilgiler ve logoya ilişkin tüm fikir mülkiyet hakları AEB Avukatlık Ortaklığı&apos;na aittir.
          </p>
        </div>
      </div>
    </footer>
  );
}
