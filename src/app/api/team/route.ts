import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ members });
  } catch (error) {
    console.error("Team fetch error:", error);
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
    const { nameTr, nameEn, roleTr, roleEn, specialtyTr, specialtyEn, image, order } = body;

    if (!nameTr || !roleTr || !specialtyTr) {
      return NextResponse.json(
        { error: "İsim, unvan ve uzmanlık alanı (TR) zorunludur" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.create({
      data: {
        nameTr,
        nameEn: nameEn || null,
        roleTr,
        roleEn: roleEn || null,
        specialtyTr,
        specialtyEn: specialtyEn || null,
        image: image || null,
        order: order ?? 0,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Team create error:", error);
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
    const { id, nameTr, nameEn, roleTr, roleEn, specialtyTr, specialtyEn, image, order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    if (!nameTr || !roleTr || !specialtyTr) {
      return NextResponse.json(
        { error: "İsim, unvan ve uzmanlık alanı (TR) zorunludur" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        nameTr,
        nameEn: nameEn || null,
        roleTr,
        roleEn: roleEn || null,
        specialtyTr,
        specialtyEn: specialtyEn || null,
        image: image || null,
        order: order ?? 0,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Team update error:", error);
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

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
