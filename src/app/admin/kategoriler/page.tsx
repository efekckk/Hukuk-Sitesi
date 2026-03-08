import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoriesClient } from "./categories-client";

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { order: "asc" },
  });

  const serialized = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameTr: c.nameTr,
    nameEn: c.nameEn,
    order: c.order,
    _count: c._count,
  }));

  return <CategoriesClient initialCategories={serialized} />;
}
