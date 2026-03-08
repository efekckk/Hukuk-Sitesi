"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 3 | 4;
}

export function BentoGrid({ children, className, columns = 4 }: BentoGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className={cn("py-20 relative", className)}>
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          className={cn(
            "grid gap-4 md:gap-5",
            "grid-cols-1 md:grid-cols-2",
            columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
            "auto-rows-[minmax(180px,auto)]",
            "[grid-auto-flow:dense]"
          )}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
