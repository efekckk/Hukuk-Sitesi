import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FileText, MessageSquare, Bell, FolderOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  // Fetch all counts in parallel
  const [postCount, messageCount, unreadCount, categoryCount, recentMessages] =
    await Promise.all([
      prisma.blogPost.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
      prisma.category.count(),
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    {
      label: "Toplam Yazi",
      count: postCount,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-900/30",
    },
    {
      label: "Toplam Mesaj",
      count: messageCount,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
      darkBgColor: "dark:bg-green-900/30",
    },
    {
      label: "Okunmamis Mesaj",
      count: unreadCount,
      icon: Bell,
      color: "text-red-600",
      bgColor: "bg-red-50",
      darkBgColor: "dark:bg-red-900/30",
    },
    {
      label: "Kategoriler",
      count: categoryCount,
      icon: FolderOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      darkBgColor: "dark:bg-purple-900/30",
    },
  ];

  const statusLabels: Record<string, { label: string; className: string }> = {
    UNREAD: {
      label: "Okunmadi",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    READ: {
      label: "Okundu",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    REPLIED: {
      label: "Yanitlandi",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    ARCHIVED: {
      label: "Arsivlendi",
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    },
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.count}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor} ${stat.darkBgColor}`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Messages */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Son Mesajlar
          </h2>
        </div>

        {recentMessages.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Henuz mesaj bulunmuyor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Ad
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Konu
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Tarih
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((msg) => {
                  const status = statusLabels[msg.status] || statusLabels.UNREAD;
                  return (
                    <tr
                      key={msg.id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50/50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        {msg.name}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {msg.subject}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {formatDate(msg.createdAt, "tr")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
