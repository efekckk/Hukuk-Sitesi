import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SliderClient } from "./slider-client";

export default async function AdminSliderPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const items = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = items.map((item) => ({
    id: item.id,
    taglineTr: item.taglineTr,
    taglineEn: item.taglineEn,
    titleTr: item.titleTr,
    titleEn: item.titleEn,
    subtitleTr: item.subtitleTr,
    subtitleEn: item.subtitleEn,
    ctaTextTr: item.ctaTextTr,
    ctaTextEn: item.ctaTextEn,
    ctaLink: item.ctaLink,
    secondaryCtaTextTr: item.secondaryCtaTextTr,
    secondaryCtaTextEn: item.secondaryCtaTextEn,
    secondaryCtaLink: item.secondaryCtaLink,
    secondaryCtaIsExternal: item.secondaryCtaIsExternal,
    order: item.order,
    isActive: item.isActive,
  }));

  return <SliderClient initialItems={serialized} />;
}
