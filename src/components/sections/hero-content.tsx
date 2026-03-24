"use client";

import { motion } from "framer-motion";
import { TextReveal } from "@/components/ui/text-reveal";

interface HeroContentProps {
  title: string;
  subtitle: string;
  subtitle2?: string;
}

export function HeroContent({ title, subtitle, subtitle2 }: HeroContentProps) {
  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 1.2,
      },
    },
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center" style={{ paddingLeft: "clamp(2rem, 5vw, 5rem)" }}>
      <div style={{ maxWidth: "34rem" }}>
        <TextReveal
          text={title}
          className="font-serif font-light leading-[1.1] text-white"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)" }}
          staggerDelay={0.1}
          yOffset={50}
          duration={0.8}
        />
        <motion.p
          className="leading-[1.7] text-white/55"
          style={{
            fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
            maxWidth: "28rem",
            marginTop: "1.5rem",
          }}
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          {subtitle}
        </motion.p>
        {subtitle2 && (
          <motion.p
            className="leading-relaxed text-white/50"
            style={{
              fontSize: "var(--fs-sm)",
              maxWidth: "26rem",
              marginTop: "0.75rem",
            }}
            variants={subtitleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {subtitle2}
          </motion.p>
        )}
      </div>
    </div>
  );
}
