"use client";

import { Shield, Heart, Briefcase, Building2, Landmark, Home, Scale, Users, Star, Target, Lightbulb, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Shield, Heart, Briefcase, Building2, Landmark, Home, Scale, Users, Star, Target, Lightbulb, BookOpen,
};

interface BentoServiceCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export function BentoServiceCard({ slug, title, description, icon }: BentoServiceCardProps) {
  const Icon = iconMap[icon] || Shield;

  const content = (
    <div className="flex flex-col h-full p-6">
      <div className="w-12 h-12 bg-white/[0.05] rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-300">
        <Icon className="w-6 h-6 text-brand-400 group-hover:text-brand-300 transition-colors duration-300" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-400 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-neutral-400 text-sm leading-relaxed flex-1 line-clamp-3">
        {description}
      </p>
      {slug && (
        <div className="mt-4 flex items-center gap-1 text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span>Detay</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  if (slug) {
    return (
      <Link href={`/hizmetlerimiz/${slug}`} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
