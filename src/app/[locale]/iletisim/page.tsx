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

  const contactSettings = await prisma.siteSetting.findMany({
    where: { group: "contact" },
  });
  const settingsMap = Object.fromEntries(contactSettings.map((s) => [s.key, s]));

  const address = (locale === "en" && settingsMap.address?.valueEn)
    ? settingsMap.address.valueEn
    : settingsMap.address?.valueTr || "Levent Mah. Hukuk Sok. No:1 Kat:5, Besiktas/Istanbul";
  const phone = settingsMap.phone?.valueTr || "+90 212 123 45 67";
  const phoneRaw = settingsMap.phone_raw?.valueTr || "+902121234567";
  const email = settingsMap.email?.valueTr || "info@hukukburosu.com";
  const workingHours = (locale === "en" && settingsMap.working_hours?.valueEn)
    ? settingsMap.working_hours.valueEn
    : settingsMap.working_hours?.valueTr || t("info.hoursValue");
  const saturday = (locale === "en" && settingsMap.working_hours_saturday?.valueEn)
    ? settingsMap.working_hours_saturday.valueEn
    : settingsMap.working_hours_saturday?.valueTr || t("info.saturday");

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} backgroundImage="/images/cinematic/inner-hero-business.jpg" />

      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {t("form.submit").replace("Gonder", "Formu").replace("Send", "Form")}
              </h2>
              <ContactForm />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                {locale === "tr" ? "Iletisim Bilgileri" : "Contact Information"}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-white/[0.05] rounded-full flex items-center justify-center border border-white/[0.06]">
                    <MapPin className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">{t("info.address")}</h3>
                    <p className="text-neutral-400">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-white/[0.05] rounded-full flex items-center justify-center border border-white/[0.06]">
                    <Phone className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">{t("info.phone")}</h3>
                    <a href={`tel:${phoneRaw}`} className="text-neutral-400 hover:text-brand-400 transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-white/[0.05] rounded-full flex items-center justify-center border border-white/[0.06]">
                    <Mail className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">{t("info.email")}</h3>
                    <a href={`mailto:${email}`} className="text-neutral-400 hover:text-brand-400 transition-colors">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-white/[0.05] rounded-full flex items-center justify-center border border-white/[0.06]">
                    <Clock className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1">{t("info.hours")}</h3>
                    <p className="text-neutral-400">{workingHours}</p>
                    <p className="text-neutral-400">{saturday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 relative">
        <div className="max-w-6xl mx-auto px-4">
          <GoogleMap />
        </div>
      </section>
    </>
  );
}
