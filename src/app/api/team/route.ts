import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRole, canAccess } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { rateLimit, getIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rl = rateLimit(`team-get:${getIp(request)}`, RATE_LIMITS.publicList);
  if (!rl.success) return NextResponse.json({ error: "Çok fazla istek" }, { status: 429 });
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

    const role = await getUserRole(session.user.id);
    if (!role || !canAccess(role, "team")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
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

    await logAudit({ userId: session.user.id, action: "CREATE", entity: "TeamMember", entityId: member.id, details: nameTr });

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

    const role = await getUserRole(session.user.id);
    if (!role || !canAccess(role, "team")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
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

    await logAudit({ userId: session.user.id, action: "UPDATE", entity: "TeamMember", entityId: id, details: nameTr });

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

    const role = await getUserRole(session.user.id);
    if (!role || !canAccess(role, "team")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    await prisma.teamMember.delete({ where: { id } });

    await logAudit({ userId: session.user.id, action: "DELETE", entity: "TeamMember", entityId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
