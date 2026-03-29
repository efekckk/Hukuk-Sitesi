import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MessagesClient } from "./messages-client";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

  const serialized = messages.map((msg) => ({
    id: msg.id,
    name: msg.name,
    email: msg.email,
    phone: msg.phone,
    subject: msg.subject,
    message: msg.message,
    status: msg.status,
    createdAt: msg.createdAt.toISOString(),
    formattedDate: formatDate(msg.createdAt, "tr"),
    kvkkConsent: msg.kvkkConsent,
    kvkkConsentAt: msg.kvkkConsentAt?.toISOString() ?? null,
    kvkkVersion: msg.kvkkVersion ?? null,
    kvkkIp: msg.kvkkIp ?? null,
  }));

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mesajlar</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
              {unreadCount} yeni
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          İletişim formundan gelen tüm mesajlar
        </p>
      </div>

      <MessagesClient messages={serialized} />
    </div>
  );
}
