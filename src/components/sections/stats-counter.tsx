"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface StatsCounterProps {
  stats?: StatItem[];
}

const defaultStats: (StatItem & { key: string })[] = [
  { key: "experience", value: 15, suffix: "+", label: "" },
  { key: "cases", value: 500, suffix: "+", label: "" },
  { key: "clients", value: 3000, suffix: "+", label: "" },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * value);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(value);
      }
    }

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsCounter({ stats: propStats }: StatsCounterProps) {
  const t = useTranslations("stats");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const items: StatItem[] = propStats && propStats.length > 0
    ? propStats
    : defaultStats.map((s) => ({
        value: s.value,
        suffix: s.suffix,
        label: t(`${s.key}.label`),
      }));

  return (
    <section className="py-20 bg-emerald-900 border-t border-emerald-800 border-b border-b-emerald-800">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="section-divider pt-4 text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {items.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <div className="w-8 h-0.5 bg-secondary mx-auto mb-3" />
              <p className="text-gray-400 text-lg">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
