import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { KvkkEditorClient } from "./kvkk-editor-client";

export default async function AdminKvkkPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const currentUser = await prisma.adminUser.findUnique({
    where: { id: session.user!.id! },
    select: { role: true },
  });
  if (currentUser?.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const page = await prisma.pageContent.findUnique({
    where: { slug: "kvkk" },
  });

  const serialized = page
    ? {
        id: page.id,
        slug: page.slug,
        titleTr: page.titleTr,
        titleEn: page.titleEn,
        contentTr: page.contentTr,
        contentEn: page.contentEn,
      }
    : null;

  return <KvkkEditorClient initialPage={serialized} />;
}
