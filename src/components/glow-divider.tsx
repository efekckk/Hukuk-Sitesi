"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowDividerProps {
  className?: string;
}

export function GlowDivider({ className }: GlowDividerProps) {
  return (
    <div
      className={cn("relative h-px w-full overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Base line */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
      />

      {/* Sweeping glow */}
      <motion.div
        className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-brand-400/15 to-transparent"
        animate={{ left: ["-33%", "100%"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
      />
    </div>
  );
}
