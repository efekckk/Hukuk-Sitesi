"use client";

interface BentoTextCardProps {
  headline: string;
  subtext?: string;
  accentLine?: boolean;
}

export function BentoTextCard({ headline, subtext, accentLine = true }: BentoTextCardProps) {
  return (
    <div className="flex flex-col justify-center h-full p-8">
      {accentLine && (
        <div className="w-14 h-1 bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 rounded-full mb-4" />
      )}
      <h2 className="text-2xl md:text-3xl font-bold font-heading text-white leading-tight mb-3">
        {headline}
      </h2>
      {subtext && (
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">{subtext}</p>
      )}
    </div>
  );
}
