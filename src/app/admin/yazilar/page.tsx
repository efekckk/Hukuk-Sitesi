import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PostsClient } from "./posts-client";

export default async function AdminPostsPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const posts = await prisma.blogPost.findMany({
    include: {
      category: true,
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleTr: p.titleTr,
    isPublished: p.isPublished,
    isFeatured: p.isFeatured,
    categoryName: p.category?.nameTr ?? null,
    authorName: p.author.name,
    createdAt: formatDate(p.createdAt, "tr"),
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Yazılar</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Toplam {posts.length} yazı
          </p>
        </div>
        <Link
          href="/admin/yazilar/yeni"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Yazı
        </Link>
      </div>

      <PostsClient posts={serialized} />
    </div>
  );
}
