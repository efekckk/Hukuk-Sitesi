"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { TracingBeam } from "@/components/tracing-beam";
import { ScrollReveal } from "@/components/scroll-reveal";

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

  const faqItems: FaqItemData[] = items && items.length > 0
    ? items
    : faqIndices.map((i) => ({
        question: t(`items.${i}.question`),
        answer: t(`items.${i}.answer`),
      }));

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="section-divider pt-4 text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
              {t("title")}
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <TracingBeam className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-2xl overflow-hidden transition-all duration-500",
                    isOpen ? "bg-[#161616]" : "bg-[#111]"
                  )}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-white font-medium pr-4">
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.7 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-brand-400" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-neutral-400 leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </TracingBeam>
        </ScrollReveal>
      </div>
    </section>
  );
}
