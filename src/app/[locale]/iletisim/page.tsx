import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { GoogleMap } from "@/components/google-map";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/sections/page-hero";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations("contact");

  const contactSettings = await prisma.siteSetting.findMany({ where: { group: "contact" } });
  const settingsMap = Object.fromEntries(contactSettings.map((s) => [s.key, s]));

  const address = (locale === "en" && settingsMap.address?.valueEn)
    ? settingsMap.address.valueEn
    : settingsMap.address?.valueTr || "AEB Hukuk\nKEY Plaza, Merkez, İstiklal Sokağı No:11 K:3-4, 34384 Şişli / İstanbul";
  const phone = settingsMap.phone?.valueTr || "+90 212 123 45 67";
  const phoneRaw = settingsMap.phone_raw?.valueTr || "+902121234567";
  const email = settingsMap.email?.valueTr || "info@aebhukuk.com";
  const workingHours = (locale === "en" && settingsMap.working_hours?.valueEn)
    ? settingsMap.working_hours.valueEn
    : settingsMap.working_hours?.valueTr || t("info.hoursValue");
  const saturday = (locale === "en" && settingsMap.working_hours_saturday?.valueEn)
    ? settingsMap.working_hours_saturday.valueEn
    : settingsMap.working_hours_saturday?.valueTr || t("info.saturday");
  const mapsUrl = settingsMap.maps_embed_url?.valueTr || undefined;

  const infoItems = [
    {
      icon: MapPin,
      label: t("info.address"),
      content: <p className="leading-relaxed text-black/50" style={{ fontSize: "var(--fs-sm)" }}>{address}</p>,
    },
    {
      icon: Phone,
      label: t("info.phone"),
      content: (
        <a href={`tel:${phoneRaw}`} className="text-black/50 hover:text-black transition-colors" style={{ fontSize: "var(--fs-sm)" }}>
          {phone}
        </a>
      ),
    },
    {
      icon: Mail,
      label: t("info.email"),
      content: (
        <a href={`mailto:${email}`} className="text-black/50 hover:text-black transition-colors" style={{ fontSize: "var(--fs-sm)" }}>
          {email}
        </a>
      ),
    },
    {
      icon: Clock,
      label: t("info.hours"),
      content: (
        <>
          <p className="text-black/50" style={{ fontSize: "var(--fs-sm)" }}>{workingHours}</p>
          <p className="text-black/30" style={{ fontSize: "var(--fs-sm)" }}>{saturday}</p>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} backgroundImage="/images/cinematic/inner-hero-business.jpg" />

      <section className="bg-[#f5f5f3]" style={{ padding: "var(--section-py) var(--section-px)" }}>
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2" style={{ gap: "var(--space-2xl)" }}>

          {/* Form */}
          <div>
            <p className="tracking-[0.2em] uppercase text-black/30" style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-xs)" }}>
              {locale === "tr" ? "Bize Yazın" : "Get in Touch"}
            </p>
            <h2 className="font-['Cormorant_Garamond'] font-normal text-black leading-snug" style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--space-xl)" }}>
              {locale === "tr" ? "Durumunuzu değerlendirmek için hazırız." : "We are ready to evaluate your situation."}
            </h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div>
            <p className="tracking-[0.2em] uppercase text-black/30" style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-xs)" }}>
              {locale === "tr" ? "İletişim" : "Contact"}
            </p>
            <h2 className="font-['Cormorant_Garamond'] font-normal text-black leading-snug" style={{ fontSize: "var(--fs-2xl)", marginBottom: "var(--space-xl)" }}>
              {locale === "tr" ? "Bilgilerimiz" : "Our Details"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
              {infoItems.map(({ icon: Icon, label, content }) => (
                <div key={label} className="flex items-start" style={{ gap: "var(--space-md)" }}>
                  <div className="shrink-0 border border-black/10 flex items-center justify-center mt-0.5" style={{ width: "clamp(2rem,2.5vw,2.8rem)", height: "clamp(2rem,2.5vw,2.8rem)" }}>
                    <Icon className="text-black/40" style={{ width: "var(--fs-base)", height: "var(--fs-base)" }} />
                  </div>
                  <div>
                    <p className="tracking-[0.15em] uppercase text-black/30" style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-xs)" }}>
                      {label}
                    </p>
                    {content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <GoogleMap embedUrl={mapsUrl} className="!aspect-[3.5/1]" />
      </section>
    </>
  );
}
