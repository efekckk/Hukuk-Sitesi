import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialsClient } from "./testimonials-client";

export default async function AdminTestimonialsPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const items = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = items.map((item) => ({
    id: item.id,
    nameTr: item.nameTr,
    nameEn: item.nameEn,
    roleTr: item.roleTr,
    roleEn: item.roleEn,
    textTr: item.textTr,
    textEn: item.textEn,
    order: item.order,
    isActive: item.isActive,
  }));

  return <TestimonialsClient initialItems={serialized} />;
}
