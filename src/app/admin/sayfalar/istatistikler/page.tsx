import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatsEditorClient } from "./stats-editor-client";

export default async function AdminStatsPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const settings = await prisma.siteSetting.findMany({
    where: { group: "stats" },
  });

  const serialized = settings.map((s) => ({
    id: s.id,
    key: s.key,
    valueTr: s.valueTr,
    valueEn: s.valueEn,
    group: s.group,
  }));

  return <StatsEditorClient initialSettings={serialized} />;
}
