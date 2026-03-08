"use client";

import { useTranslations } from "next-intl";
import {
  BentoGrid,
  BentoCard,
  BentoStatCard,
  BentoServiceCard,
  BentoTextCard,
  BentoCtaCard,
} from "@/components/bento";

interface AboutBentoProps {
  description: string;
  stats: { value: number; suffix: string; label: string }[];
  values: { icon: string; title: string; description: string }[];
}

export function AboutBento({ description, stats, values }: AboutBentoProps) {
  const t = useTranslations("about");

  return (
    <BentoGrid columns={3}>
      {/* Large description card (2x2) */}
      <BentoCard size="xl">
        <BentoTextCard
          headline={t("values.title")}
          subtext={description}
        />
      </BentoCard>

      {/* Stats stacked in right column */}
      {stats[0] && (
        <BentoCard>
          <BentoStatCard {...stats[0]} />
        </BentoCard>
      )}
      {stats[1] && (
        <BentoCard>
          <BentoStatCard {...stats[1]} />
        </BentoCard>
      )}

      {/* Values row */}
      {values.map((value, i) => (
        <BentoCard key={i}>
          <BentoServiceCard
            slug=""
            title={value.title}
            description={value.description}
            icon={value.icon}
          />
        </BentoCard>
      ))}

      {/* Third stat if exists */}
      {stats[2] && (
        <BentoCard>
          <BentoStatCard {...stats[2]} />
        </BentoCard>
      )}

      {/* CTA card (wide) */}
      <BentoCard size="md">
        <BentoCtaCard
          title={t("team")}
          buttonText={t("values.title")}
          buttonHref="/ekibimiz"
        />
      </BentoCard>
    </BentoGrid>
  );
}
