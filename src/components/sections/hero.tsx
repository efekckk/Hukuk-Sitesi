"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Scale, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden bg-primary-dark">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#171717]/90 to-[#171717]/70" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="max-w-xl">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-secondary mb-4">
              {t("tagline")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 leading-tight">
              {t("title")}
            </h1>
            <p className="text-lg text-white/70 mb-10 leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/iletisim"
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "bg-secondary text-white font-medium",
                  "h-12 px-8 text-base rounded-lg",
                  "hover:bg-secondary-light transition-colors"
                )}
              >
                {t("cta")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/uzmanlik-alanlari"
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "border-2 border-secondary text-secondary font-medium",
                  "h-12 px-8 text-base rounded-lg",
                  "hover:bg-secondary hover:text-white transition-colors"
                )}
              >
                {t("secondaryCta")}
              </Link>
            </div>
          </div>

          {/* Right: Gold-framed image */}
          <div className="hidden lg:flex justify-center">
            <div className="gold-frame">
              <div className="relative w-[400px] h-[500px] rounded overflow-hidden">
                <Image
                  src="/images/hero-justice.jpg"
                  alt="Justice"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Fallback placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#262626] to-[#0a0a0a] flex items-center justify-center">
                  <Scale className="w-24 h-24 text-secondary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
