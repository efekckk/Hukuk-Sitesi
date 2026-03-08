"use client";

import { NumberTicker } from "@/components/ui/number-ticker";

interface BentoStatCardProps {
  value: number;
  suffix: string;
  label: string;
}

export function BentoStatCard({ value, suffix, label }: BentoStatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
        <NumberTicker value={value} suffix={suffix} className="text-white" />
      </div>
      <div className="w-10 h-0.5 bg-gradient-to-r from-brand-500/60 via-brand-400/60 to-brand-500/60 mx-auto mb-3 rounded-full" />
      <p className="text-neutral-400 text-sm md:text-base">{label}</p>
    </div>
  );
}
