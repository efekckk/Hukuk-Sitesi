import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, MessageSquare, Bell, FolderOpen, Plus, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { MESSAGE_STATUS_LABELS, MESSAGE_STATUS_CLASSES, PAGINATION } from "@/lib/constants/admin";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const [
    postCount,
    publishedPostCount,
    messageCount,
    unreadCount,
    categoryCount,
    recentMessages,
    recentPosts,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
    prisma.category.count(),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: PAGINATION.DASHBOARD_RECENT_ITEMS,
    }),
    prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: PAGINATION.DASHBOARD_RECENT_ITEMS,
      include: { category: true },
    }),
  ]);

  const stats = [
    {
      label: "Toplam Yazı",
      count: postCount,
      sub: `${publishedPostCount} yayında`,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      href: "/admin/yazilar",
    },
    {
      label: "Toplam Mesaj",
      count: messageCount,
      sub: `${unreadCount} okunmamış`,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      href: "/admin/mesajlar",
    },
    {
      label: "Okunmamış Mesaj",
      count: unreadCount,
      sub: "Yanıt bekliyor",
      icon: Bell,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/30",
      href: "/admin/mesajlar",
    },
    {
      label: "Kategoriler",
      count: categoryCount,
      sub: "Blog kategorisi",
      icon: FolderOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      href: "/admin/kategoriler",
    },
  ];

  const statusLabels = Object.fromEntries(
    Object.keys(MESSAGE_STATUS_LABELS).map((k) => [
      k,
      { label: MESSAGE_STATUS_LABELS[k as keyof typeof MESSAGE_STATUS_LABELS], className: MESSAGE_STATUS_CLASSES[k as keyof typeof MESSAGE_STATUS_CLASSES] },
    ])
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/yazilar/yeni"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Yeni Yazı
          </Link>
          {unreadCount > 0 && (
            <Link
              href="/admin/mesajlar"
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount} Yeni Mesaj
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.count}</p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{stat.sub}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Son Mesajlar</h2>
            <Link href="/admin/mesajlar" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Tümünü gör →
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">Henüz mesaj yok.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentMessages.map((msg) => {
                const status = statusLabels[msg.status] || statusLabels.UNREAD;
                return (
                  <div key={msg.id} className={`flex items-center justify-between px-6 py-3 ${msg.status === "UNREAD" ? "bg-blue-50/40 dark:bg-blue-900/10" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{msg.name}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">{msg.subject}</p>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(msg.createdAt, "tr")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Son Yazılar</h2>
            <Link href="/admin/yazilar" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Tümünü gör →
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Henüz yazı yok.{" "}
              <Link href="/admin/yazilar/yeni" className="text-blue-600 dark:text-blue-400 hover:underline">
                İlk yazıyı oluştur →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between px-6 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{post.titleTr}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {post.category?.nameTr || "Kategorisiz"} · {formatDate(post.createdAt, "tr")}
                    </p>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-2">
                    {post.isPublished ? (
                      <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                        Yayında
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                        Taslak
                      </span>
                    )}
                    <Link href={`/admin/yazilar/${post.id}`}
                      className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors">
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
