import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PracticeAreasClient } from "./practice-areas-client";

export default async function AdminPracticeAreasPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const areas = await prisma.practiceArea.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = areas.map((a) => ({
    id: a.id,
    slug: a.slug,
    titleTr: a.titleTr,
    titleEn: a.titleEn,
    descriptionTr: a.descriptionTr,
    descriptionEn: a.descriptionEn,
    longDescTr: a.longDescTr,
    longDescEn: a.longDescEn,
    icon: a.icon,
    image: a.image,
    itemsTr: a.itemsTr,
    itemsEn: a.itemsEn,
    order: a.order,
  }));

  return <PracticeAreasClient initialAreas={serialized} />;
}
