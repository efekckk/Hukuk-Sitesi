import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminDarkWrapper } from "@/components/layout/admin-dark-wrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return session ? (
    <AdminDarkWrapper>
      <div className="admin-theme min-h-screen bg-gray-100 dark:bg-gray-950">
        <AdminSidebar />
        <main className="ml-64 min-h-screen p-8">{children}</main>
      </div>
    </AdminDarkWrapper>
  ) : (
    <AdminDarkWrapper>
      <div className="admin-theme">
        {children}
      </div>
    </AdminDarkWrapper>
  );
}
