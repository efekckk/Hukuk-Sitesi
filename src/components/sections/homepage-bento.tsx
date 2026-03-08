"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import {
  Shield,
  Heart,
  Briefcase,
  Building2,
  Landmark,
  Home,
  Scale,
  Users,
  Star,
  Target,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BentoStatCard } from "@/components/bento/bento-stat-card";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/scroll-reveal";

const iconMap: Record<string, LucideIcon> = {
  Shield, Heart, Briefcase, Building2, Landmark, Home, Scale, Users, Star, Target, Lightbulb, BookOpen,
};

interface HomepageBentoProps {
  practiceAreas: { slug: string; title: string; description: string; icon: string }[];
  stats: { value: number; suffix: string; label: string }[];
}

/* ─── Animation helpers ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

function AnimatedGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

/* ─── Card wrapper with dark bg ─── */
function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "group relative bg-[#111] rounded-2xl overflow-hidden",
        "hover:bg-[#181818] transition-all duration-500",
        className
      )}
    >
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

export function HomepageBento({ practiceAreas, stats }: HomepageBentoProps) {
  const t = useTranslations("bentoGrid");

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* ─── Section Header ─── */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <div className="w-14 h-1 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 rounded-full mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-3">
              {t("headline")}
            </h2>
            <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {t("subtext")}
            </p>
          </div>
        </ScrollReveal>

        {/* ─── Stats Row ─── */}
        {stats.length > 0 && (
          <ScrollReveal delay={0.15}>
            <AnimatedGroup className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-14">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <BentoStatCard {...stat} />
                </Card>
              ))}
            </AnimatedGroup>
          </ScrollReveal>
        )}

        {/* ─── Services Grid ─── */}
        {practiceAreas.length > 0 && (
          <ScrollReveal delay={0.15}>
            <AnimatedGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10">
            {practiceAreas.slice(0, 6).map((area) => {
              const Icon = iconMap[area.icon] || Shield;
              return (
                <Card key={area.slug}>
                  <Link
                    href={`/uzmanlik-alanlari/${area.slug}`}
                    className="flex flex-col h-full p-6"
                  >
                    <div className="w-12 h-12 bg-white/[0.05] rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/[0.08] transition-colors duration-300">
                      <Icon className="w-6 h-6 text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors duration-300">
                      {area.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed flex-1 line-clamp-3">
                      {area.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      <span>{t("detail")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </Card>
              );
            })}
          </AnimatedGroup>
          </ScrollReveal>
        )}

        {/* ─── CTA ─── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/iletisim"
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "h-12 px-10 text-sm rounded-full font-bold transition-all duration-300",
              "bg-brand-700 text-white hover:bg-brand-600",
              "shadow-lg shadow-brand-800/20 hover:shadow-xl hover:shadow-brand-800/25"
            )}
          >
            {t("ctaButton")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
