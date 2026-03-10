"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["about", "contact"] as const;
const valueKeys = ["integrity", "expertise", "dedication"] as const;

export function StoryTabs() {
  const t = useTranslations("storyTabs");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("about");

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Tab bar — serif, ince alt çizgi */}
        <div className="flex gap-0 border-b border-black/10 mb-20">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "font-serif text-lg font-light px-10 py-4 -mb-px border-b transition-all duration-300",
                activeTab === tab
                  ? "border-black text-[#1a1a1a]"
                  : "border-transparent text-black/30 hover:text-black/60"
              )}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "about" ? (
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-serif text-4xl font-light text-[#1a1a1a] leading-tight lg:text-5xl">
                {t("about.title")}
              </h2>
              <p className="mt-8 text-[15px] leading-[1.9] text-[#555]">
                {t("about.description")}
              </p>

              {/* Değerler — ikon yok, sadece metin + ince soldan çizgi */}
              <div className="mt-10 grid grid-cols-1 gap-0 sm:grid-cols-3 border-l border-black/10">
                {valueKeys.map((key) => (
                  <div key={key} className="pl-6 pr-4 py-3 border-r border-black/10 last:border-r-0">
                    <span className="font-serif text-sm text-[#1a1a1a] italic">
                      {t(`about.values.${key}`)}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/hakkimizda"
                className="mt-12 inline-flex items-center gap-3 text-sm tracking-[0.15em] uppercase text-[#1a1a1a] group"
              >
                <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
                {t("about.cta")}
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="/images/lawyer-client.jpg"
                alt=""
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-start">
            <div>
              <h2 className="font-serif text-4xl font-light text-[#1a1a1a] leading-tight lg:text-5xl">
                {t("contact.title")}
              </h2>
              <div className="mt-10 space-y-7">
                {[
                  { Icon: MapPin, content: t("contact.address") },
                  { Icon: Phone, content: t("contact.phone") },
                  { Icon: Mail, content: t("contact.email") },
                ].map(({ Icon, content }, i) => (
                  <div key={i} className="flex items-start gap-5 border-b border-black/[0.06] pb-7">
                    <Icon className="w-4 h-4 text-black/25 mt-0.5 shrink-0" />
                    <span className="text-[#555] text-sm leading-relaxed">{content}</span>
                  </div>
                ))}
                <div className="flex items-start gap-5">
                  <Clock className="w-4 h-4 text-black/25 mt-0.5 shrink-0" />
                  <div className="text-[#555] text-sm leading-relaxed">
                    <p>{t("contact.hours")}</p>
                    <p className="mt-0.5">{t("contact.saturday")}</p>
                  </div>
                </div>
              </div>

              <Link
                href="/iletisim"
                className="mt-12 inline-flex items-center gap-3 text-sm tracking-[0.15em] uppercase text-[#1a1a1a] group"
              >
                <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
                {t("contact.cta")}
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="/images/handshake.jpg"
                alt=""
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
