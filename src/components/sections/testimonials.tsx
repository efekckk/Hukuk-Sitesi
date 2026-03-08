"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

const fallbackIndices = [0, 1, 2] as const;

/* ─── Individual card with spotlight ─── */
function TestimonialCard({
  item,
}: {
  item: TestimonialItem;
  index: number;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const spotlight = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(182,140,90,0.08), transparent 80%)`;

  return (
    <div onMouseMove={handleMouseMove} className="group relative">
      {/* Dark card */}
      <div
        className={cn(
          "relative h-full rounded-2xl p-6 overflow-hidden",
          "bg-[#111]",
          "group-hover:bg-[#181818]",
          "group-hover:scale-[1.02]",
          "transition-all duration-500"
        )}
      >
        {/* Mouse spotlight */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[1]"
          style={{ background: spotlight }}
        />

        <div className="relative z-10">
          <Quote className="w-10 h-10 text-brand-400 mb-4" />
          <p className="text-neutral-400 text-sm leading-relaxed mb-6 italic">
            &ldquo;{item.text}&rdquo;
          </p>
          <div className="border-t border-white/[0.03] pt-4">
            <p className="font-semibold text-white">{item.name}</p>
            <p className="text-sm text-neutral-500">{item.role}</p>
          </div>
        </div>

        {/* Animated bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden z-[1]">
          <div className="w-0 h-full bg-gradient-to-r from-brand-600 to-brand-400 group-hover:w-full transition-all duration-700 ease-out" />
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const t = useTranslations("testimonials");

  const items: TestimonialItem[] =
    testimonials && testimonials.length > 0
      ? testimonials
      : fallbackIndices.map((index) => ({
          name: t(`items.${index}.name`),
          role: t(`items.${index}.role`),
          text: t(`items.${index}.text`),
        }));

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Chess metaphor background */}
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <img src="/images/cinematic/metaphor-chess.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/80" />

      <div className="container mx-auto px-4 relative z-10">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <TestimonialCard key={index} item={item} index={index} />
          ))}
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
