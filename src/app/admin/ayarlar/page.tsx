import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const currentUser = await prisma.adminUser.findUnique({
    where: { id: session.user!.id! },
    select: { role: true },
  });
  if (currentUser?.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const settings = await prisma.siteSetting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  const grouped = settings.reduce<
    Record<string, { id: string; key: string; valueTr: string | null; valueEn: string | null; group: string | null }[]>
  >((acc, setting) => {
    const group = setting.group || "general";
    if (!acc[group]) acc[group] = [];
    acc[group].push({
      id: setting.id,
      key: setting.key,
      valueTr: setting.valueTr,
      valueEn: setting.valueEn,
      group: setting.group,
    });
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-dark">Site Ayarları</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Site genelindeki ayarları görüntüleyin ve düzenleyin
        </p>
      </div>
      <SettingsClient grouped={grouped} />
    </div>
  );
}
