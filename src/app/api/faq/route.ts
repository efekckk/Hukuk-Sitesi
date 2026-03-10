import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRole, canAccess } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const items = await prisma.faqItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("FAQ fetch error:", error);
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
    if (!role || !canAccess(role, "faq")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const body = await request.json();
    const { questionTr, questionEn, answerTr, answerEn, order } = body;

    if (!questionTr || !answerTr) {
      return NextResponse.json(
        { error: "Soru ve cevap (TR) zorunludur" },
        { status: 400 }
      );
    }

    const item = await prisma.faqItem.create({
      data: {
        questionTr,
        questionEn: questionEn || null,
        answerTr,
        answerEn: answerEn || null,
        order: order ?? 0,
      },
    });

    await logAudit({ userId: session.user.id, action: "CREATE", entity: "FaqItem", entityId: item.id, details: questionTr });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("FAQ create error:", error);
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
    if (!role || !canAccess(role, "faq")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const body = await request.json();
    const { id, questionTr, questionEn, answerTr, answerEn, order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    if (!questionTr || !answerTr) {
      return NextResponse.json(
        { error: "Soru ve cevap (TR) zorunludur" },
        { status: 400 }
      );
    }

    const item = await prisma.faqItem.update({
      where: { id },
      data: {
        questionTr,
        questionEn: questionEn || null,
        answerTr,
        answerEn: answerEn || null,
        order: order ?? 0,
      },
    });

    await logAudit({ userId: session.user.id, action: "UPDATE", entity: "FaqItem", entityId: id, details: questionTr });

    return NextResponse.json(item);
  } catch (error) {
    console.error("FAQ update error:", error);
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
    if (!role || !canAccess(role, "faq")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    await prisma.faqItem.delete({ where: { id } });

    await logAudit({ userId: session.user.id, action: "DELETE", entity: "FaqItem", entityId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FAQ delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
