import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.value.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Value fetch error:", error);
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
    const { titleTr, titleEn, descriptionTr, descriptionEn, icon, order } = body;

    if (!titleTr || !descriptionTr) {
      return NextResponse.json({ error: "Başlık ve açıklama (TR) zorunludur" }, { status: 400 });
    }

    const item = await prisma.value.create({
      data: {
        titleTr,
        titleEn: titleEn || null,
        descriptionTr,
        descriptionEn: descriptionEn || null,
        icon: icon || "Award",
        order: order ?? 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Value create error:", error);
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
    const { id, titleTr, titleEn, descriptionTr, descriptionEn, icon, order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    if (!titleTr || !descriptionTr) {
      return NextResponse.json({ error: "Başlık ve açıklama (TR) zorunludur" }, { status: 400 });
    }

    const item = await prisma.value.update({
      where: { id },
      data: {
        titleTr,
        titleEn: titleEn || null,
        descriptionTr,
        descriptionEn: descriptionEn || null,
        icon: icon || "Award",
        order: order ?? 0,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Value update error:", error);
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

    await prisma.value.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Value delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
