import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Phone } from "lucide-react";

interface CtaProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  phoneText?: string;
  phoneRaw?: string;
  locale?: string;
}

export async function Cta({ title, subtitle, buttonText, phoneText, phoneRaw, locale = "tr" }: CtaProps) {
  const t = await getTranslations({ locale, namespace: "cta" });

  const displayTitle = title || t("title");
  const displaySubtitle = subtitle || t("subtitle");
  const displayButton = buttonText || t("button");
  const displayPhone = phoneText || t("phone");
  const telLink = phoneRaw || "+902121234567";

  return (
    <section className="relative bg-[#0a0a0a] py-32 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/gavel-stock.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl font-light text-white leading-tight lg:text-5xl xl:text-6xl max-w-3xl mx-auto">
          {displayTitle}
        </h2>
        <p className="mt-6 text-base text-white/40 max-w-xl mx-auto">
          {displaySubtitle}
        </p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/iletisim"
            className="inline-block bg-white px-10 py-4 text-sm tracking-widest uppercase text-[#0a0a0a] font-medium transition-all hover:bg-white/90"
          >
            {displayButton}
          </Link>
          <a
            href={`tel:${telLink}`}
            className="inline-flex items-center gap-2 border border-white/20 px-10 py-4 text-sm tracking-widest uppercase text-white/60 transition-all hover:border-white/50 hover:text-white"
          >
            <Phone className="w-4 h-4" />
            {displayPhone}
          </a>
        </div>
      </div>
    </section>
  );
}
