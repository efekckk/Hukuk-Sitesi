import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("HeroSlide fetch error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const {
      taglineTr, taglineEn, titleTr, titleEn, subtitleTr, subtitleEn,
      ctaTextTr, ctaTextEn, ctaLink,
      secondaryCtaTextTr, secondaryCtaTextEn, secondaryCtaLink, secondaryCtaIsExternal,
      order, isActive,
    } = body;

    if (!taglineTr || !titleTr || !subtitleTr || !ctaTextTr || !ctaLink) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const item = await prisma.heroSlide.create({
      data: {
        taglineTr,
        taglineEn: taglineEn || null,
        titleTr,
        titleEn: titleEn || null,
        subtitleTr,
        subtitleEn: subtitleEn || null,
        ctaTextTr,
        ctaTextEn: ctaTextEn || null,
        ctaLink,
        secondaryCtaTextTr: secondaryCtaTextTr || null,
        secondaryCtaTextEn: secondaryCtaTextEn || null,
        secondaryCtaLink: secondaryCtaLink || null,
        secondaryCtaIsExternal: secondaryCtaIsExternal ?? false,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("HeroSlide create error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    if (!data.taglineTr || !data.titleTr || !data.subtitleTr || !data.ctaTextTr || !data.ctaLink) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const item = await prisma.heroSlide.update({
      where: { id },
      data: {
        taglineTr: data.taglineTr,
        taglineEn: data.taglineEn || null,
        titleTr: data.titleTr,
        titleEn: data.titleEn || null,
        subtitleTr: data.subtitleTr,
        subtitleEn: data.subtitleEn || null,
        ctaTextTr: data.ctaTextTr,
        ctaTextEn: data.ctaTextEn || null,
        ctaLink: data.ctaLink,
        secondaryCtaTextTr: data.secondaryCtaTextTr || null,
        secondaryCtaTextEn: data.secondaryCtaTextEn || null,
        secondaryCtaLink: data.secondaryCtaLink || null,
        secondaryCtaIsExternal: data.secondaryCtaIsExternal ?? false,
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("HeroSlide update error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    await prisma.heroSlide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("HeroSlide delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
