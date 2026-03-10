import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TeamClient } from "./team-client";

export default async function AdminTeamPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const currentUser = await prisma.adminUser.findUnique({
    where: { id: session.user!.id! },
    select: { role: true },
  });
  if (currentUser?.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = members.map((m) => ({
    id: m.id,
    nameTr: m.nameTr,
    nameEn: m.nameEn,
    roleTr: m.roleTr,
    roleEn: m.roleEn,
    specialtyTr: m.specialtyTr,
    specialtyEn: m.specialtyEn,
    image: m.image,
    order: m.order,
  }));

  return <TeamClient initialMembers={serialized} />;
}
