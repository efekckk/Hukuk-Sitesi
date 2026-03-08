import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FaqClient } from "./faq-client";

export default async function AdminFaqPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const items = await prisma.faqItem.findMany({
    orderBy: { order: "asc" },
  });

  const serialized = items.map((item) => ({
    id: item.id,
    questionTr: item.questionTr,
    questionEn: item.questionEn,
    answerTr: item.answerTr,
    answerEn: item.answerEn,
    order: item.order,
  }));

  return <FaqClient initialItems={serialized} />;
}
