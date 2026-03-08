import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const currentUser = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const serialized = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: formatDate(u.createdAt, "tr"),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kullanıcılar</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Admin paneli kullanıcılarını yönetin
          {!isSuperAdmin && (
            <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
              — Yeni kullanıcı oluşturmak için Süper Admin yetkisi gereklidir
            </span>
          )}
        </p>
      </div>
      <UsersClient
        users={serialized}
        currentUserId={session.user.id!}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}
