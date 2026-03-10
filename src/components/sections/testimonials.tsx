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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="font-serif text-4xl font-light text-[#1a1a1a] lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base text-[#666] max-w-xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-8 flex flex-col gap-6">
              <Quote className="w-8 h-8 text-black/10" />
              <p className="text-sm leading-relaxed text-[#555] italic flex-1">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="border-t border-black/10 pt-6">
                <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                <p className="text-xs text-[#999] mt-0.5">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
