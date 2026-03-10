import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRole, canAccess } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get("group");

    const where = group ? { group } : {};
    const settings = await prisma.siteSetting.findMany({ where });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings fetch error:", error);
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
    if (!role || !canAccess(role, "settings")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const body = await request.json();

    // Support batch update: array of settings
    if (Array.isArray(body)) {
      const results = [];
      for (const item of body) {
        const { id, valueTr, valueEn } = item;
        if (!id) continue;
        const setting = await prisma.siteSetting.update({
          where: { id },
          data: { valueTr, valueEn },
        });
        results.push(setting);
      }

      await logAudit({ userId: session.user.id, action: "UPDATE", entity: "SiteSetting", details: "Toplu güncelleme" });

      return NextResponse.json(results);
    }

    // Single update
    const { id, valueTr, valueEn } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    const setting = await prisma.siteSetting.update({
      where: { id },
      data: { valueTr, valueEn },
    });

    await logAudit({ userId: session.user.id, action: "UPDATE", entity: "SiteSetting", entityId: id, details: setting.key });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
