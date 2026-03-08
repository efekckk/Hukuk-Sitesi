"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface CtaProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  phoneText?: string;
  phoneRaw?: string;
}

export function Cta({ title, subtitle, buttonText, phoneText, phoneRaw }: CtaProps) {
  const t = useTranslations("cta");

  const displayTitle = title || t("title");
  const displaySubtitle = subtitle || t("subtitle");
  const displayButton = buttonText || t("button");
  const displayPhone = phoneText || t("phone");
  const telLink = phoneRaw || "+902121234567";

  return (
    <section className="py-20 relative overflow-hidden bg-[#0a0a0a]">
      {/* Lighthouse metaphor background — chiaroscuro */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/cinematic/metaphor-lighthouse.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "grayscale(90%) contrast(1.3) brightness(0.3)", mixBlendMode: "lighten" }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="relative text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            {displayTitle}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            {displaySubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/iletisim">
              <ShimmerButton
                shimmerColor="#b68c5a"
                background="rgba(255, 255, 255, 1)"
                className="h-14 px-10 text-base font-bold text-[#0a0a0a] shadow-lg"
              >
                {displayButton}
              </ShimmerButton>
            </Link>
            <a
              href={`tel:${telLink}`}
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "border-2 border-white/15 text-white font-medium",
                "h-14 px-10 text-base rounded-full",
                "hover:bg-white/[0.03] hover:border-white/30 transition-all duration-300"
              )}
            >
              <Phone className="w-5 h-5" />
              {displayPhone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
