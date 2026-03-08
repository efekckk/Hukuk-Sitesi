import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContactEditorClient } from "./contact-editor-client";

export default async function AdminContactPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const settings = await prisma.siteSetting.findMany({
    where: { group: "contact" },
    orderBy: { key: "asc" },
  });

  const serialized = settings.map((s) => ({
    id: s.id,
    key: s.key,
    valueTr: s.valueTr,
    valueEn: s.valueEn,
    group: s.group,
  }));

  return <ContactEditorClient initialSettings={serialized} />;
}
