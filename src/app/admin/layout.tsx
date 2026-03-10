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

  if (!session) {
    return (
      <AdminDarkWrapper>
        <div className="admin-theme">
          {children}
        </div>
      </AdminDarkWrapper>
    );
  }

  const unreadCount = await prisma.contactSubmission.count({ where: { status: "UNREAD" } });

  return (
    <AdminDarkWrapper>
      <div className="admin-theme min-h-screen bg-gray-100 dark:bg-gray-950">
        <AdminSidebar unreadCount={unreadCount} />
        <main className="ml-64 min-h-screen p-8">{children}</main>
      </div>
    </AdminDarkWrapper>
  );
}
