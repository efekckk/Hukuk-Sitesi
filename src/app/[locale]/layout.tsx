import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CookieConsent } from "@/components/cookie-consent";
import { PopupNotification } from "@/components/popup-notification";
import { AuroraBackground } from "@/components/aurora-background";
import { SmoothScroll } from "@/components/smooth-scroll";
import { prisma } from "@/lib/prisma";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "tr" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const now = new Date();
  const [messages, dbAreas, dbPopups] = await Promise.all([
    getMessages(),
    prisma.practiceArea.findMany({ orderBy: { order: "asc" }, select: { slug: true, titleTr: true, titleEn: true, icon: true } }),
    prisma.popup.findMany({
      where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
      orderBy: { order: "asc" },
      select: { id: true, titleTr: true, titleEn: true, messageTr: true, messageEn: true, type: true, linkUrl: true, linkTextTr: true, linkTextEn: true },
    }),
  ]);

  const practiceAreas = dbAreas.map((a) => ({
    slug: a.slug,
    title: (locale === "en" && a.titleEn) ? a.titleEn : a.titleTr,
    icon: a.icon,
  }));

  return (
    <NextIntlClientProvider messages={messages}>
      <SmoothScroll>
        <AuroraBackground />
        <div className="relative z-10">
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar practiceAreas={practiceAreas} />
          </div>
          <main className="min-h-screen pt-16">{children}</main>
          <Footer locale={locale} />
        </div>
        <WhatsAppButton />
        <CookieConsent />
        <PopupNotification popups={dbPopups} locale={locale} />
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}
