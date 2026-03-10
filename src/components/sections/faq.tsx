"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface FaqItemData {
  question: string;
  answer: string;
}

interface FaqProps {
  items?: FaqItemData[];
}

const faqIndices = [0, 1, 2, 3, 4] as const;

export function Faq({ items }: FaqProps) {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems: FaqItemData[] =
    items && items.length > 0
      ? items
      : faqIndices.map((i) => ({
          question: t(`items.${i}.question`),
          answer: t(`items.${i}.answer`),
        }));

  return (
    <section className="bg-[#f5f5f3] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header — serif başlık + solda numara */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-black/30 mb-3">SSS</p>
            <h2 className="font-serif text-4xl font-light text-[#1a1a1a] leading-tight lg:text-5xl">
              {t("title")}
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-[#666] self-end">
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
                  className="w-full flex items-start justify-between py-7 px-0 text-left group"
                >
                  {/* Numara + soru */}
                  <div className="flex items-start gap-6 pr-8">
                    <span className="font-serif text-sm text-black/20 mt-0.5 w-6 shrink-0 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={cn(
                      "font-serif text-lg font-light leading-snug transition-colors",
                      isOpen ? "text-[#1a1a1a]" : "text-[#444] group-hover:text-[#1a1a1a]"
                    )}>
                      {item.question}
                    </span>
                  </div>

                  {/* + / − işareti */}
                  <span className={cn(
                    "font-serif text-2xl font-light text-black/30 shrink-0 leading-none transition-all duration-300 mt-0.5",
                    isOpen ? "text-black/60 rotate-0" : ""
                  )}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div className={cn(
                  "overflow-hidden transition-all duration-400",
                  isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="pl-12 pr-12 pb-8">
                    <p className="text-[15px] leading-[1.9] text-[#555]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
