import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Testimonial fetch error:", error);
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
    const { nameTr, nameEn, roleTr, roleEn, textTr, textEn, order, isActive } = body;

    if (!nameTr || !roleTr || !textTr) {
      return NextResponse.json({ error: "Ad, rol ve metin (TR) zorunludur" }, { status: 400 });
    }

    const item = await prisma.testimonial.create({
      data: {
        nameTr,
        nameEn: nameEn || null,
        roleTr,
        roleEn: roleEn || null,
        textTr,
        textEn: textEn || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Testimonial create error:", error);
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
    const { id, nameTr, nameEn, roleTr, roleEn, textTr, textEn, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    if (!nameTr || !roleTr || !textTr) {
      return NextResponse.json({ error: "Ad, rol ve metin (TR) zorunludur" }, { status: 400 });
    }

    const item = await prisma.testimonial.update({
      where: { id },
      data: {
        nameTr,
        nameEn: nameEn || null,
        roleTr,
        roleEn: roleEn || null,
        textTr,
        textEn: textEn || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Testimonial update error:", error);
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

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
