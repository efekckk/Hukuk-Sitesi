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
    <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
      <div className="mx-auto max-w-7xl">

        {/* Tab bar */}
        <div className="flex gap-0 border-b border-black/10" style={{ marginBottom: "var(--space-2xl)" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "font-serif font-light -mb-px border-b transition-all duration-300",
                activeTab === tab
                  ? "border-black text-[#1a1a1a]"
                  : "border-transparent text-black/30 hover:text-black/60"
              )}
              style={{ fontSize: "var(--fs-lg)", padding: "var(--space-sm) var(--space-xl)" }}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "about" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: "var(--space-2xl)" }}>
            <div>
              <h2 className="font-serif font-light text-[#1a1a1a] leading-tight" style={{ fontSize: "var(--fs-4xl)" }}>
                {t("about.title")}
              </h2>
              <p className="leading-[1.9] text-[#555]" style={{ fontSize: "var(--fs-base)", marginTop: "var(--space-lg)" }}>
                {t("about.description")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 border-l border-black/10" style={{ marginTop: "var(--space-lg)" }}>
                {valueKeys.map((key) => (
                  <div key={key} className="border-r border-black/10 last:border-r-0" style={{ padding: "var(--space-sm) var(--space-sm) var(--space-sm) var(--space-md)" }}>
                    <span className="font-serif text-[#1a1a1a] italic" style={{ fontSize: "var(--fs-sm)" }}>
                      {t(`about.values.${key}`)}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/hakkimizda"
                className="inline-flex items-center gap-3 tracking-[0.15em] uppercase text-[#1a1a1a] group"
                style={{ fontSize: "var(--fs-xs)", marginTop: "var(--space-xl)" }}
              >
                <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
                {t("about.cta")}
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src="/images/lawyer-client.jpg" alt="" className="h-full w-full object-cover grayscale" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: "var(--space-2xl)" }}>
            <div>
              <h2 className="font-serif font-light text-[#1a1a1a] leading-tight" style={{ fontSize: "var(--fs-4xl)" }}>
                {t("contact.title")}
              </h2>
              <div style={{ marginTop: "var(--space-xl)" }}>
                {[
                  { Icon: MapPin, content: t("contact.address") },
                  { Icon: Phone, content: t("contact.phone") },
                  { Icon: Mail, content: t("contact.email") },
                ].map(({ Icon, content }, i) => (
                  <div key={i} className="flex items-start border-b border-black/[0.06]" style={{ gap: "var(--space-md)", paddingBottom: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
                    <Icon className="text-black/25 mt-0.5 shrink-0" style={{ width: "var(--fs-base)", height: "var(--fs-base)" }} />
                    <span className="text-[#555] leading-relaxed" style={{ fontSize: "var(--fs-sm)" }}>{content}</span>
                  </div>
                ))}
                <div className="flex items-start" style={{ gap: "var(--space-md)" }}>
                  <Clock className="text-black/25 mt-0.5 shrink-0" style={{ width: "var(--fs-base)", height: "var(--fs-base)" }} />
                  <div className="text-[#555] leading-relaxed" style={{ fontSize: "var(--fs-sm)" }}>
                    <p>{t("contact.hours")}</p>
                    <p>{t("contact.saturday")}</p>
                  </div>
                </div>
              </div>

              <Link
                href="/iletisim"
                className="inline-flex items-center gap-3 tracking-[0.15em] uppercase text-[#1a1a1a] group"
                style={{ fontSize: "var(--fs-xs)", marginTop: "var(--space-xl)" }}
              >
                <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
                {t("contact.cta")}
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src="/images/handshake.jpg" alt="" className="h-full w-full object-cover grayscale" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
