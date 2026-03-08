import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const locale = searchParams.get("locale") || "tr";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const isTr = locale === "tr";
  const query = `%${q}%`;

  try {
    const [practiceAreas, blogPosts, faqItems, teamMembers] = await Promise.all([
      // Practice Areas
      prisma.practiceArea.findMany({
        where: {
          OR: [
            { titleTr: { contains: q, mode: "insensitive" } },
            { titleEn: { contains: q, mode: "insensitive" } },
            { descriptionTr: { contains: q, mode: "insensitive" } },
            { descriptionEn: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { slug: true, titleTr: true, titleEn: true, descriptionTr: true, descriptionEn: true, icon: true },
        take: 5,
      }),

      // Blog Posts (only published)
      prisma.blogPost.findMany({
        where: {
          isPublished: true,
          OR: [
            { titleTr: { contains: q, mode: "insensitive" } },
            { titleEn: { contains: q, mode: "insensitive" } },
            { excerptTr: { contains: q, mode: "insensitive" } },
            { excerptEn: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { slug: true, titleTr: true, titleEn: true, excerptTr: true, excerptEn: true, publishedAt: true },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),

      // FAQ Items
      prisma.faqItem.findMany({
        where: {
          OR: [
            { questionTr: { contains: q, mode: "insensitive" } },
            { questionEn: { contains: q, mode: "insensitive" } },
            { answerTr: { contains: q, mode: "insensitive" } },
            { answerEn: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, questionTr: true, questionEn: true, answerTr: true, answerEn: true },
        take: 3,
      }),

      // Team Members
      prisma.teamMember.findMany({
        where: {
          OR: [
            { nameTr: { contains: q, mode: "insensitive" } },
            { nameEn: { contains: q, mode: "insensitive" } },
            { specialtyTr: { contains: q, mode: "insensitive" } },
            { specialtyEn: { contains: q, mode: "insensitive" } },
            { roleTr: { contains: q, mode: "insensitive" } },
            { roleEn: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true, nameTr: true, nameEn: true, roleTr: true, roleEn: true, specialtyTr: true, specialtyEn: true, image: true },
        take: 3,
      }),
    ]);

    const results = {
      practiceAreas: practiceAreas.map((a) => ({
        type: "practiceArea" as const,
        title: isTr ? a.titleTr : (a.titleEn || a.titleTr),
        description: isTr ? a.descriptionTr : (a.descriptionEn || a.descriptionTr),
        href: `/uzmanlik-alanlari/${a.slug}`,
        icon: a.icon,
      })),
      blogPosts: blogPosts.map((p) => ({
        type: "blogPost" as const,
        title: isTr ? p.titleTr : (p.titleEn || p.titleTr),
        description: isTr ? (p.excerptTr || "") : (p.excerptEn || p.excerptTr || ""),
        href: `/blog/${p.slug}`,
        date: p.publishedAt?.toISOString(),
      })),
      faqItems: faqItems.map((f) => ({
        type: "faq" as const,
        title: isTr ? f.questionTr : (f.questionEn || f.questionTr),
        description: (isTr ? f.answerTr : (f.answerEn || f.answerTr)).slice(0, 120) + "...",
        href: "/sss",
      })),
      teamMembers: teamMembers.map((m) => ({
        type: "team" as const,
        title: isTr ? m.nameTr : (m.nameEn || m.nameTr),
        description: isTr
          ? `${m.roleTr}${m.specialtyTr ? ` — ${m.specialtyTr}` : ""}`
          : `${m.roleEn || m.roleTr}${(m.specialtyEn || m.specialtyTr) ? ` — ${m.specialtyEn || m.specialtyTr}` : ""}`,
        href: "/ekibimiz",
        image: m.image,
      })),
    };

    const totalCount =
      results.practiceAreas.length +
      results.blogPosts.length +
      results.faqItems.length +
      results.teamMembers.length;

    return NextResponse.json({ results, totalCount });
  } catch {
    return NextResponse.json({ results: [], totalCount: 0 });
  }
}
