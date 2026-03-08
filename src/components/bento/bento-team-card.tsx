"use client";

import { User } from "lucide-react";

interface BentoTeamCardProps {
  name: string;
  role: string;
  specialty: string;
  image: string | null;
}

export function BentoTeamCard({ name, role, specialty, image }: BentoTeamCardProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Photo area */}
      <div className="relative flex-1 min-h-[160px] bg-gradient-to-br from-white/[0.04] to-white/[0.06] flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        ) : (
          <User className="w-16 h-16 text-white/20 group-hover:text-white/30 transition-colors duration-500" />
        )}
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent opacity-60" />
      </div>
      {/* Info */}
      <div className="p-4 text-center">
        <h3 className="text-base font-bold font-heading text-white mb-0.5">{name}</h3>
        <p className="text-brand-400 text-xs font-medium uppercase tracking-wide mb-0.5">{role}</p>
        <p className="text-neutral-500 text-xs">{specialty}</p>
      </div>
    </div>
  );
}
