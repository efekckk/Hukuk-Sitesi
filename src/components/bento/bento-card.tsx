"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

type BentoSize = "sm" | "md" | "lg" | "xl";

interface BentoCardProps {
  children: React.ReactNode;
  size?: BentoSize;
  className?: string;
  onClick?: () => void;
  glowColor?: "purple" | "cyan" | "mixed";
}

const sizeMap: Record<BentoSize, string> = {
  sm: "",
  md: "md:col-span-2",
  lg: "md:row-span-2",
  xl: "md:col-span-2 md:row-span-2",
};

const glowMap: Record<string, string> = {
  purple: "from-brand-400/8 to-brand-400/8",
  cyan: "from-brand-400/8 to-brand-400/8",
  mixed: "from-brand-400/8 to-brand-400/8",
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  },
};

export function BentoCard({
  children,
  size = "sm",
  className,
  onClick,
  glowColor = "mixed",
}: BentoCardProps) {
  /* ─── Card spotlight ─── */
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

  const spotlight = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(182,140,90,0.08), transparent 80%)`;

  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative group",
        "hover:scale-[1.02]",
        "transition-all duration-500",
        onClick && "cursor-pointer",
        sizeMap[size],
        className
      )}
    >
      {/* Subtle shadow layer behind the card */}
      <div
        className={cn(
          "absolute -inset-[1px] rounded-2xl blur-xl opacity-0 group-hover:opacity-40",
          "transition-opacity duration-700",
          "bg-gradient-to-r",
          glowMap[glowColor]
        )}
      />

      {/* Card surface */}
      <div
        className={cn(
          "relative h-full rounded-2xl overflow-hidden",
          "bg-[#111111]",
          "border-none",
          "group-hover:bg-[#181818]",
          "transition-all duration-500"
        )}
      >
        {/* Mouse spotlight overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[1]"
          style={{ background: spotlight }}
        />
        {/* Inner gradient shimmer on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/10 via-transparent to-brand-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </motion.div>
  );
}
