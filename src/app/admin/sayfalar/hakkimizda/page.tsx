import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AboutEditorClient } from "./about-editor-client";

export default async function AdminAboutPage() {
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
    where: { group: "about" },
    orderBy: { key: "asc" },
  });

  const serialized = settings.map((s) => ({
    id: s.id,
    key: s.key,
    valueTr: s.valueTr,
    valueEn: s.valueEn,
    group: s.group,
  }));

  return <AboutEditorClient initialSettings={serialized} />;
}
