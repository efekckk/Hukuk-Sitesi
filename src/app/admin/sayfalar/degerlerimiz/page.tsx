import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ValuesClient } from "./values-client";

export default async function AdminValuesPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const currentUser = await prisma.adminUser.findUnique({
    where: { id: session.user!.id! },
    select: { role: true },
  });
  if (currentUser?.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const items = await prisma.value.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = items.map((item) => ({
    id: item.id,
    titleTr: item.titleTr,
    titleEn: item.titleEn,
    descriptionTr: item.descriptionTr,
    descriptionEn: item.descriptionEn,
    icon: item.icon,
    order: item.order,
  }));

  return <ValuesClient initialItems={serialized} />;
}
