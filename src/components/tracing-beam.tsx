"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TracingBeamProps {
  children: React.ReactNode;
  className?: string;
}

export function TracingBeam({ children, className }: TracingBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 30%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const beamHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const dotTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const dotOpacity = useTransform(
    smoothProgress,
    [0, 0.03, 0.95, 1],
    [0, 1, 1, 0]
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Tracing beam — left side */}
      <div className="absolute left-2 md:left-6 top-0 bottom-0 w-[2px] hidden md:block">
        {/* Base track */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

        {/* Animated fill */}
        <motion.div
          className="absolute top-0 left-0 w-full rounded-full"
          style={{
            height: beamHeight,
            background:
              "linear-gradient(to bottom, rgba(182,140,90,0.5), rgba(166,124,74,0.4), rgba(182,140,90,0.2))",
            boxShadow: "0 0 8px rgba(182,140,90,0.3)",
          }}
        />

        {/* Glowing dot */}
        <motion.div
          className="absolute -left-[5px] w-3 h-3 rounded-full"
          style={{
            top: dotTop,
            opacity: dotOpacity,
            background:
              "radial-gradient(circle, rgba(182,140,90,0.9), rgba(166,124,74,0.5))",
            boxShadow:
              "0 0 15px rgba(182,140,90,0.6), 0 0 40px rgba(182,140,90,0.2)",
          }}
        />
      </div>

      {/* Content */}
      <div className="md:pl-14">{children}</div>
    </div>
  );
}
