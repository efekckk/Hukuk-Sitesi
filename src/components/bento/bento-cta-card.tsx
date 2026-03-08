"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoCtaCardProps {
  title: string;
  buttonText: string;
  buttonHref: string;
  phoneText?: string;
  phoneHref?: string;
}

export function BentoCtaCard({ title, buttonText, buttonHref, phoneText, phoneHref }: BentoCtaCardProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <p className="text-white font-semibold text-lg mb-4">{title}</p>
      <Link
        href={buttonHref}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "h-11 px-8 text-sm rounded-full font-bold transition-all duration-300",
          "bg-brand-700 text-white hover:bg-brand-600",
          "shadow-lg shadow-brand-900/30",
          "hover:shadow-xl hover:shadow-brand-900/40"
        )}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </Link>
      {phoneText && phoneHref && (
        <a
          href={phoneHref}
          className="mt-3 inline-flex items-center gap-2 text-neutral-500 text-sm hover:text-white transition-colors"
        >
          <Phone className="w-4 h-4" />
          {phoneText}
        </a>
      )}
    </div>
  );
}
