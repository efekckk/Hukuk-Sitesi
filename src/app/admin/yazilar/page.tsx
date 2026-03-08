import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminPostsPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const posts = await prisma.blogPost.findMany({
    include: {
      category: true,
      author: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Yazilar</h1>
        <Link
          href="/admin/yazilar/yeni"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Yazi
        </Link>
      </div>

      {/* Posts Table */}
      <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Henuz yazi bulunmuyor. Ilk yazinizi olusturun!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Baslik
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Kategori
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Durum
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Tarih
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {post.titleTr}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {post.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {post.category?.nameTr || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {post.isPublished ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                          Yayinda
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                          Taslak
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(post.createdAt, "tr")}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/yazilar/${post.id}`}
                        className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                      >
                        Duzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
