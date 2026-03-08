"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "p" | "span";
}

/**
 * Scroll-driven text reveal: words fade from dim to full opacity
 * as the user scrolls through the section.
 */
export function TextReveal({ text, className, as: Tag = "p" }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef}>
      <Tag className={cn("flex flex-wrap", className)}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </Tag>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <span className="relative mr-[0.3em] mt-1">
      {/* Ghost (always visible for layout) */}
      <span className="opacity-[0.15]">{children}</span>
      {/* Revealed word */}
      <motion.span
        className="absolute inset-0"
        style={{ opacity }}
      >
        {children}
      </motion.span>
    </span>
  );
}
