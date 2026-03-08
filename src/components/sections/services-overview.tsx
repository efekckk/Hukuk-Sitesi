"use client";

import { useTranslations } from "next-intl";
import { Shield, Heart, Briefcase, Building2, Landmark, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Heart,
  Briefcase,
  Building2,
  Landmark,
  Home,
};

interface ServiceCard {
  key: string;
  icon: LucideIcon;
}

const defaultServices: ServiceCard[] = [
  { key: "criminal", icon: Shield },
  { key: "family", icon: Heart },
  { key: "labor", icon: Briefcase },
  { key: "commercial", icon: Building2 },
  { key: "administrative", icon: Landmark },
  { key: "realEstate", icon: Home },
];

export interface PracticeAreaItem {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

interface ServicesOverviewProps {
  items?: PracticeAreaItem[];
}

export function ServicesOverview({ items }: ServicesOverviewProps) {
  const t = useTranslations("services");

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="section-divider pt-4 text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items
            ? items.map((item) => {
                const Icon = iconMap[item.icon] || Shield;
                return (
                  <div
                    key={item.slug}
                    className={cn(
                      "bg-card rounded-2xl p-6 hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 hover:scale-[1.03]",
                      "border-t-4 border-secondary"
                    )}
                  >
                    <div className="flex items-center justify-center w-14 h-14 bg-secondary/10 rounded-lg mb-5">
                      <Icon className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })
            : defaultServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.key}
                    className={cn(
                      "bg-card rounded-2xl p-6 hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 hover:scale-[1.03]",
                      "border-t-4 border-secondary"
                    )}
                  >
                    <div className="flex items-center justify-center w-14 h-14 bg-secondary/10 rounded-lg mb-5">
                      <Icon className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t(`${service.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t(`${service.key}.description`)}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
