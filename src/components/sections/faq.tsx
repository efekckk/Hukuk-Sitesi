"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface FaqItemData {
  question: string;
  answer: string;
}

interface FaqProps {
  items?: FaqItemData[];
  maxItems?: number;
  showMoreLink?: boolean;
}

const faqIndices = [0, 1, 2, 3, 4] as const;

export function Faq({ items, maxItems, showMoreLink }: FaqProps) {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const allItems: FaqItemData[] =
    items && items.length > 0
      ? items
      : faqIndices.map((i) => ({
          question: t(`items.${i}.question`),
          answer: t(`items.${i}.answer`),
        }));

  const faqItems = maxItems ? allItems.slice(0, maxItems) : allItems;

  return (
    <section className="bg-[#f5f5f3]" style={{ padding: "var(--section-py) var(--section-px)" }}>
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]" style={{ gap: "var(--space-xl)", marginBottom: "var(--space-2xl)" }}>
          <div>
            <p className="tracking-[0.2em] uppercase text-black/30" style={{ fontSize: "var(--fs-micro)", marginBottom: "var(--space-xs)" }}>SSS</p>
            <h2 className="font-serif font-light text-[#1a1a1a] leading-tight" style={{ fontSize: "var(--fs-3xl)" }}>
              {t("title")}
            </h2>
          </div>
          <p className="leading-relaxed text-[#666] self-end" style={{ fontSize: "var(--fs-base)" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-4xl">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "border-t border-black/10 last:border-b",
                  isOpen && "bg-white"
                )}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-start justify-between text-left group"
                  style={{ padding: "var(--space-lg) 0" }}
                >
                  <div className="flex items-start" style={{ gap: "var(--space-md)", paddingRight: "var(--space-lg)" }}>
                    <span className="font-serif text-black/20 mt-0.5 w-6 shrink-0 tabular-nums" style={{ fontSize: "var(--fs-sm)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={cn(
                      "font-serif font-light leading-snug transition-colors",
                      isOpen ? "text-[#1a1a1a]" : "text-[#444] group-hover:text-[#1a1a1a]"
                    )} style={{ fontSize: "var(--fs-lg)" }}>
                      {item.question}
                    </span>
                  </div>
                  <span className={cn(
                    "font-serif font-light text-black/30 shrink-0 leading-none transition-all duration-300 mt-0.5",
                    isOpen && "text-black/60"
                  )} style={{ fontSize: "var(--fs-2xl)" }}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div className={cn(
                  "overflow-hidden transition-all duration-400",
                  isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div style={{ paddingLeft: "calc(var(--space-md) + 1.5rem)", paddingRight: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}>
                    <p className="leading-[1.9] text-[#555]" style={{ fontSize: "var(--fs-base)" }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showMoreLink && (
          <div style={{ marginTop: "var(--space-xl)" }}>
            <Link
              href="/sss"
              className="inline-flex items-center gap-3 tracking-[0.15em] uppercase text-[#1a1a1a] group"
              style={{ fontSize: "var(--fs-xs)" }}
            >
              <span className="h-px w-8 bg-black/40 transition-all duration-300 group-hover:w-14 group-hover:bg-black" />
              {t("viewAll")}
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
