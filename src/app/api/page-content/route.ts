import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRole, canAccess } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug gerekli" }, { status: 400 });
    }

    const page = await prisma.pageContent.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json({ error: "Sayfa bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("PageContent fetch error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const role = await getUserRole(session.user.id);
    if (!role || !canAccess(role, "page-content")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const body = await request.json();
    const { slug, titleTr, titleEn, contentTr, contentEn } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug gerekli" }, { status: 400 });
    }

    if (!titleTr || !contentTr) {
      return NextResponse.json({ error: "Başlık ve içerik (TR) zorunludur" }, { status: 400 });
    }

    const page = await prisma.pageContent.upsert({
      where: { slug },
      update: {
        titleTr,
        titleEn: titleEn || null,
        contentTr,
        contentEn: contentEn || null,
      },
      create: {
        slug,
        titleTr,
        titleEn: titleEn || null,
        contentTr,
        contentEn: contentEn || null,
      },
    });

    await logAudit({ userId: session.user.id, action: "UPDATE", entity: "PageContent", entityId: page.id, details: slug });

    return NextResponse.json(page);
  } catch (error) {
    console.error("PageContent update error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
