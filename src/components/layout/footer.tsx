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
  const email = contactMap["email"] || "info@aebhukuk.com";
  const address = contactMap["address"] || "Merkez Mah.\nAbide-i Hürriyet Cad. İstiklal Sok.\nNo:11 Kat:3-4 Key Plaza\nŞişli / İstanbul";

  const isTr = locale !== "en";

  return (
    <footer className="bg-[#0a0a0a] text-white/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Column 1: Logo + description */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <img
                src="/images/logo.png"
                alt="AEB Avukatlık Ortaklığı"
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/40">
              {t("description")}
            </p>
          </div>

          {/* Column 2: Pages */}
          <div>
            <h3 className="mb-6 font-serif text-base italic text-white/60">
              {isTr ? "Sayfalar" : "Pages"}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: tNav("home") },
                { href: "/hakkimizda", label: tNav("about") },
                { href: "/uzmanlik-alanlari", label: isTr ? "Hizmetlerimiz" : "Our Services" },
                { href: "/ekibimiz", label: tNav("team") },
                { href: "/blog", label: isTr ? "Yayınlar" : "Publications" },
                { href: "/sss", label: tNav("faq") },
                { href: "/iletisim", label: tNav("contact") },
                { href: "/e-tahsilat", label: "E-Tahsilat" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm italic text-white/40 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Practice Areas */}
          <div>
            <h3 className="mb-6 font-serif text-base italic text-white/60">
              {isTr ? "Çalışma Alanlarımız" : "Practice Areas"}
            </h3>
            <ul className="space-y-3">
              {practiceAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/uzmanlik-alanlari/${area.slug}`}
                    className="text-sm italic text-white/40 transition-colors hover:text-white"
                  >
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="mb-3 font-serif text-base italic text-white/60">
              {isTr ? "Telefon" : "Phone"}
            </h3>
            <p className="text-sm text-white/50">{phone}</p>

            <h3 className="mt-8 mb-3 font-serif text-base italic text-white/60">
              Email
            </h3>
            <p className="text-sm text-white/50">{email}</p>

            <h3 className="mt-8 mb-3 font-serif text-base italic text-white/60">
              {isTr ? "Adres" : "Address"}
            </h3>
            <p className="text-sm leading-relaxed text-white/50 whitespace-pre-line">
              {address}
            </p>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-5">
          <p className="text-center text-xs text-white/20 italic">
            {new Date().getFullYear()} - Bu internet sitesinde yer alan tüm bilgiler ve logoya ilişkin tüm fikir mülkiyet hakları AEB Avukatlık Ortaklığı&apos;na aittir.
          </p>
        </div>
      </div>
    </footer>
  );
}
