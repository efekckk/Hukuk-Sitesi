import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { MessageRow } from "./message-row";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Serialize for client component rows
  const serializedMessages = messages.map((msg) => ({
    id: msg.id,
    name: msg.name,
    email: msg.email,
    phone: msg.phone,
    subject: msg.subject,
    message: msg.message,
    status: msg.status,
    createdAt: msg.createdAt.toISOString(),
    formattedDate: formatDate(msg.createdAt, "tr"),
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mesajlar</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Iletisim formundan gelen tum mesajlar
        </p>
      </div>

      {/* Messages Table */}
      <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
              <MessageSquare className="h-7 w-7 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Henuz mesaj bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Ad
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    E-posta
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                    Konu
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
                {serializedMessages.map((msg) => (
                  <MessageRow key={msg.id} message={msg} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
