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
    <section className="relative bg-[#0a0a0a] overflow-hidden" style={{ padding: "var(--space-3xl) var(--section-px)" }}>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/concept-of-auction-composition-with-wooden-hammer-2026-01-09-07-14-29-utc.jpg.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]" />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <h2 className="font-serif font-light text-white leading-tight mx-auto" style={{ fontSize: "var(--fs-3xl)", maxWidth: "40rem" }}>
          {displayTitle}
        </h2>
        <p className="text-white/40 mx-auto" style={{ fontSize: "var(--fs-base)", marginTop: "var(--space-md)", maxWidth: "32rem" }}>
          {displaySubtitle}
        </p>
        <div className="flex flex-col items-center sm:flex-row sm:justify-center" style={{ marginTop: "var(--space-xl)", gap: "var(--space-sm)" }}>
          <Link
            href="/iletisim"
            className="inline-block bg-white tracking-widest uppercase text-[#0a0a0a] font-medium transition-all hover:bg-white/90"
            style={{ fontSize: "var(--fs-xs)", padding: "var(--space-sm) var(--space-xl)" }}
          >
            {displayButton}
          </Link>
          <a
            href={`tel:${telLink}`}
            className="inline-flex items-center gap-2 border border-white/20 tracking-widest uppercase text-white/60 transition-all hover:border-white/50 hover:text-white"
            style={{ fontSize: "var(--fs-xs)", padding: "var(--space-sm) var(--space-xl)" }}
          >
            <Phone className="w-[1em] h-[1em]" />
            {displayPhone}
          </a>
        </div>
      </div>
    </section>
  );
}
