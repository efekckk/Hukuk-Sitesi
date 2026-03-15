import { getTranslations } from "next-intl/server";
import { Quote } from "lucide-react";

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
  locale?: string;
}

const fallbackIndices = [0, 1, 2] as const;

export async function Testimonials({ testimonials, locale = "tr" }: TestimonialsProps) {
  const t = await getTranslations({ locale, namespace: "testimonials" });

  const items: TestimonialItem[] =
    testimonials && testimonials.length > 0
      ? testimonials
      : fallbackIndices.map((index) => ({
          name: t(`items.${index}.name`),
          role: t(`items.${index}.role`),
          text: t(`items.${index}.text`),
        }));

  return (
    <section className="bg-white" style={{ padding: "var(--section-py) var(--section-px)" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div style={{ marginBottom: "var(--space-2xl)" }}>
          <h2 className="font-serif font-light text-[#1a1a1a]" style={{ fontSize: "var(--fs-4xl)" }}>
            {t("title")}
          </h2>
          <p className="text-[#666]" style={{ fontSize: "var(--fs-base)", marginTop: "var(--space-sm)", maxWidth: "36rem" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
          {items.map((item, index) => (
            <div key={index} className="bg-white flex flex-col" style={{ padding: "var(--space-lg)", gap: "var(--space-md)" }}>
              <Quote className="text-black/10" style={{ width: "var(--fs-3xl)", height: "var(--fs-3xl)" }} />
              <p className="leading-relaxed text-[#555] italic flex-1" style={{ fontSize: "var(--fs-sm)" }}>
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="border-t border-black/10" style={{ paddingTop: "var(--space-md)" }}>
                <p className="font-medium text-[#1a1a1a]" style={{ fontSize: "var(--fs-sm)" }}>{item.name}</p>
                <p className="text-[#999]" style={{ fontSize: "var(--fs-xs)", marginTop: "0.2em" }}>{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
