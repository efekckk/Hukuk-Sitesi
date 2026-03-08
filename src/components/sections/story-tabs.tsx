"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shield, BookOpen, Heart, MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { TracingBeam } from "@/components/tracing-beam";
import { TextReveal } from "@/components/text-reveal";
import { ScrollReveal } from "@/components/scroll-reveal";

const tabs = ["about", "contact"] as const;

const valueIcons = [Shield, BookOpen, Heart] as const;
const valueKeys = ["integrity", "expertise", "dedication"] as const;

export function StoryTabs() {
  const t = useTranslations("storyTabs");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("about");

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Tab bar */}
        <ScrollReveal delay={0.1}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-[#111] rounded-2xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                    activeTab === tab
                      ? "bg-brand-700 text-white"
                      : "text-neutral-500 hover:text-white"
                  )}
                >
                  {t(`tabs.${tab}`)}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Tab content with TracingBeam */}
        <ScrollReveal delay={0.2}>
          <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "about" ? (
              <div className="max-w-4xl mx-auto">
                <TracingBeam>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
                    {t("about.title")}
                  </h2>
                  <TextReveal
                    text={t("about.description")}
                    className="text-neutral-400 text-lg leading-relaxed mb-10"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {valueKeys.map((key, i) => {
                      const Icon = valueIcons[i];
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-4 bg-[#111] rounded-2xl p-5 hover:bg-[#181818] transition-all duration-300"
                        >
                          <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 hover:bg-white/[0.08] transition-colors duration-300">
                            <Icon className="w-6 h-6 text-brand-400" />
                          </div>
                          <span className="text-white font-medium">
                            {t(`about.values.${key}`)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <Link
                    href="/hakkimizda"
                    className={cn(
                      "inline-flex items-center justify-center gap-2",
                      "bg-brand-700 text-white font-bold",
                      "h-12 px-8 text-base rounded-full",
                      "hover:bg-brand-600 transition-all duration-300",
                      "shadow-md shadow-brand-700/10"
                    )}
                  >
                    {t("about.cta")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </TracingBeam>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <TracingBeam>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-8">
                    {t("contact.title")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    <div className="flex items-start gap-4 bg-[#111] rounded-2xl p-5 hover:bg-[#181818] transition-all duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 hover:bg-white/[0.08] transition-colors duration-300">
                        <MapPin className="w-5 h-5 text-brand-400" />
                      </div>
                      <span className="text-neutral-400">{t("contact.address")}</span>
                    </div>
                    <div className="flex items-start gap-4 bg-[#111] rounded-2xl p-5 hover:bg-[#181818] transition-all duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 hover:bg-white/[0.08] transition-colors duration-300">
                        <Phone className="w-5 h-5 text-brand-400" />
                      </div>
                      <span className="text-neutral-400">{t("contact.phone")}</span>
                    </div>
                    <div className="flex items-start gap-4 bg-[#111] rounded-2xl p-5 hover:bg-[#181818] transition-all duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 hover:bg-white/[0.08] transition-colors duration-300">
                        <Mail className="w-5 h-5 text-brand-400" />
                      </div>
                      <span className="text-neutral-400">{t("contact.email")}</span>
                    </div>
                    <div className="flex items-start gap-4 bg-[#111] rounded-2xl p-5 hover:bg-[#181818] transition-all duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 hover:bg-white/[0.08] transition-colors duration-300">
                        <Clock className="w-5 h-5 text-brand-400" />
                      </div>
                      <div className="text-neutral-400">
                        <p>{t("contact.hours")}</p>
                        <p>{t("contact.saturday")}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/iletisim"
                    className={cn(
                      "inline-flex items-center justify-center gap-2",
                      "bg-brand-700 text-white font-bold",
                      "h-12 px-8 text-base rounded-full",
                      "hover:bg-brand-600 transition-all duration-300",
                      "shadow-md shadow-brand-700/10"
                    )}
                  >
                    {t("contact.cta")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </TracingBeam>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </ScrollReveal>
      </div>
    </section>
  );
}
