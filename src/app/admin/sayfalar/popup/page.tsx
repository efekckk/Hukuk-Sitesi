import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PopupClient } from "./popup-client";

export default async function AdminPopupPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const currentUser = await prisma.adminUser.findUnique({
    where: { id: session.user!.id! },
    select: { role: true },
  });
  if (currentUser?.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const items = await prisma.popup.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = items.map((item) => ({
    id: item.id,
    titleTr: item.titleTr,
    titleEn: item.titleEn,
    messageTr: item.messageTr,
    messageEn: item.messageEn,
    type: item.type,
    linkUrl: item.linkUrl,
    linkTextTr: item.linkTextTr,
    linkTextEn: item.linkTextEn,
    startDate: item.startDate.toISOString(),
    endDate: item.endDate.toISOString(),
    isActive: item.isActive,
    order: item.order,
  }));

  return <PopupClient initialItems={serialized} />;
}
