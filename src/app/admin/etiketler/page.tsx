import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TagsClient } from "./tags-client";

export default async function AdminTagsPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const tags = await prisma.tag.findMany({
    orderBy: { nameTr: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  const serialized = tags.map((t) => ({
    id: t.id,
    slug: t.slug,
    nameTr: t.nameTr,
    nameEn: t.nameEn,
    postCount: t._count.posts,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Etiketler</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Blog yazılarında kullanılan etiketleri yönetin
        </p>
      </div>
      <TagsClient tags={serialized} />
    </div>
  );
}
