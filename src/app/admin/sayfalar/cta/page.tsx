import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CtaEditorClient } from "./cta-editor-client";

export default async function AdminCtaPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const currentUser = await prisma.adminUser.findUnique({
    where: { id: session.user!.id! },
    select: { role: true },
  });
  if (currentUser?.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const ctaSettings = await prisma.siteSetting.findMany({
    where: { group: "cta" },
  });

  const phoneRaw = await prisma.siteSetting.findFirst({
    where: { key: "phone_raw" },
  });

  const allSettings = phoneRaw
    ? [...ctaSettings, phoneRaw]
    : ctaSettings;

  const serialized = allSettings.map((s) => ({
    id: s.id,
    key: s.key,
    valueTr: s.valueTr,
    valueEn: s.valueEn,
    group: s.group,
  }));

  return <CtaEditorClient initialSettings={serialized} />;
}
