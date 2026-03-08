import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.popup.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Popup fetch error:", error);
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
      titleTr, titleEn, messageTr, messageEn, type,
      linkUrl, linkTextTr, linkTextEn,
      startDate, endDate, order, isActive,
    } = body;

    if (!titleTr || !messageTr || !startDate || !endDate) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    if (type && !["modal", "banner"].includes(type)) {
      return NextResponse.json({ error: "Geçersiz tip" }, { status: 400 });
    }

    const item = await prisma.popup.create({
      data: {
        titleTr,
        titleEn: titleEn || null,
        messageTr,
        messageEn: messageEn || null,
        type: type || "modal",
        linkUrl: linkUrl || null,
        linkTextTr: linkTextTr || null,
        linkTextEn: linkTextEn || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Popup create error:", error);
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

    if (!data.titleTr || !data.messageTr || !data.startDate || !data.endDate) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    if (data.type && !["modal", "banner"].includes(data.type)) {
      return NextResponse.json({ error: "Geçersiz tip" }, { status: 400 });
    }

    const item = await prisma.popup.update({
      where: { id },
      data: {
        titleTr: data.titleTr,
        titleEn: data.titleEn || null,
        messageTr: data.messageTr,
        messageEn: data.messageEn || null,
        type: data.type || "modal",
        linkUrl: data.linkUrl || null,
        linkTextTr: data.linkTextTr || null,
        linkTextEn: data.linkTextEn || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        order: data.order ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Popup update error:", error);
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

    await prisma.popup.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Popup delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
