import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRole, canAccess } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { rateLimit, getIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rl = rateLimit(`practice-areas-get:${getIp(request)}`, RATE_LIMITS.publicList);
  if (!rl.success) return NextResponse.json({ error: "Çok fazla istek" }, { status: 429 });
  try {
    const areas = await prisma.practiceArea.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ areas });
  } catch (error) {
    console.error("PracticeArea fetch error:", error);
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
    if (!role || !canAccess(role, "practice-areas")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const body = await request.json();
    const {
      slug, titleTr, titleEn, descriptionTr, descriptionEn,
      longDescTr, longDescEn, icon, image, itemsTr, itemsEn, order,
    } = body;

    if (!slug || !titleTr || !descriptionTr || !longDescTr || !itemsTr) {
      return NextResponse.json(
        { error: "Slug, başlık, açıklama, uzun açıklama ve hizmet kalemleri (TR) zorunludur" },
        { status: 400 }
      );
    }

    const area = await prisma.practiceArea.create({
      data: {
        slug,
        titleTr,
        titleEn: titleEn || null,
        descriptionTr,
        descriptionEn: descriptionEn || null,
        longDescTr,
        longDescEn: longDescEn || null,
        icon: icon || "Shield",
        image: image || null,
        itemsTr,
        itemsEn: itemsEn || null,
        order: order ?? 0,
      },
    });

    await logAudit({ userId: session.user.id, action: "CREATE", entity: "PracticeArea", entityId: area.id, details: titleTr });

    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    console.error("PracticeArea create error:", error);
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
    if (!role || !canAccess(role, "practice-areas")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const body = await request.json();
    const {
      id, slug, titleTr, titleEn, descriptionTr, descriptionEn,
      longDescTr, longDescEn, icon, image, itemsTr, itemsEn, order,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    if (!slug || !titleTr || !descriptionTr || !longDescTr || !itemsTr) {
      return NextResponse.json(
        { error: "Slug, başlık, açıklama, uzun açıklama ve hizmet kalemleri (TR) zorunludur" },
        { status: 400 }
      );
    }

    const area = await prisma.practiceArea.update({
      where: { id },
      data: {
        slug,
        titleTr,
        titleEn: titleEn || null,
        descriptionTr,
        descriptionEn: descriptionEn || null,
        longDescTr,
        longDescEn: longDescEn || null,
        icon: icon || "Shield",
        image: image || null,
        itemsTr,
        itemsEn: itemsEn || null,
        order: order ?? 0,
      },
    });

    await logAudit({ userId: session.user.id, action: "UPDATE", entity: "PracticeArea", entityId: id, details: titleTr });

    return NextResponse.json(area);
  } catch (error) {
    console.error("PracticeArea update error:", error);
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
    if (!role || !canAccess(role, "practice-areas")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    await prisma.practiceArea.delete({ where: { id } });

    await logAudit({ userId: session.user.id, action: "DELETE", entity: "PracticeArea", entityId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PracticeArea delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
