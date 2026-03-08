import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID ve durum gerekli" }, { status: 400 });
    }

    const validStatuses = ["UNREAD", "READ", "REPLIED", "ARCHIVED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Geçersiz durum" }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Message update error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
