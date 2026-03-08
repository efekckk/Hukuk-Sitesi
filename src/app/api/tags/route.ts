import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { nameTr: "asc" },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Tags fetch error:", error);
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
    const { nameTr, nameEn, slug: customSlug } = body;

    if (!nameTr?.trim()) {
      return NextResponse.json({ error: "Etiket adı (TR) zorunludur" }, { status: 400 });
    }

    const slug = customSlug?.trim() || slugify(nameTr);

    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullanımda" }, { status: 409 });
    }

    const tag = await prisma.tag.create({
      data: { nameTr: nameTr.trim(), nameEn: nameEn?.trim() || null, slug },
      include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Tag create error:", error);
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
    const { id, nameTr, nameEn, slug: customSlug } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    if (!nameTr?.trim()) {
      return NextResponse.json({ error: "Etiket adı (TR) zorunludur" }, { status: 400 });
    }

    const slug = customSlug?.trim() || slugify(nameTr);

    const conflict = await prisma.tag.findFirst({ where: { slug, NOT: { id } } });
    if (conflict) {
      return NextResponse.json({ error: "Bu slug zaten kullanımda" }, { status: 409 });
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: { nameTr: nameTr.trim(), nameEn: nameEn?.trim() || null, slug },
      include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Tag update error:", error);
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

    await prisma.tag.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tag delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
