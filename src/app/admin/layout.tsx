import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminDarkWrapper } from "@/components/layout/admin-dark-wrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  let unreadCount = 0;
  let isSuperAdmin = false;
  let role = "EDITOR";
  let userName = "";

  if (session?.user?.id) {
    const [count, currentUser] = await Promise.all([
      prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
      prisma.adminUser.findUnique({
        where: { id: session.user.id },
        select: { role: true, name: true },
      }),
    ]);
    unreadCount = count;
    isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
    role = currentUser?.role ?? "EDITOR";
    userName = currentUser?.name ?? session.user.name ?? "";
  }

  return (
    <AdminDarkWrapper>
      <div className="admin-theme min-h-screen bg-gray-100 dark:bg-gray-950">
        <AdminSidebar
          unreadCount={unreadCount}
          isSuperAdmin={isSuperAdmin}
          role={role}
          userName={userName}
        />
        <main className="ml-64 min-h-screen p-8">{children}</main>
      </div>
    </AdminDarkWrapper>
  );
}
