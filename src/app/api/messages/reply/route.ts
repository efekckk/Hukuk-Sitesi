import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getUserRole, canAccess } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { sendAdminReply } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const role = await getUserRole(session.user.id);
    if (!role || !canAccess(role, "messages")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const body = await request.json();
    const { id, replyText } = body;

    if (!id || !replyText?.trim()) {
      return NextResponse.json({ error: "Mesaj ID ve yanıt metni gerekli" }, { status: 400 });
    }

    if (replyText.trim().length < 10) {
      return NextResponse.json({ error: "Yanıt en az 10 karakter olmalıdır" }, { status: 400 });
    }

    // Mesajı DB'den al
    const submission = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!submission) {
      return NextResponse.json({ error: "Mesaj bulunamadı" }, { status: 404 });
    }

    // E-postayı gönder
    await sendAdminReply({
      toEmail: submission.email,
      toName: submission.name,
      originalSubject: submission.subject,
      replyText: replyText.trim(),
    });

    // Durumu REPLIED olarak güncelle
    await prisma.contactSubmission.update({
      where: { id },
      data: { status: "REPLIED" },
    });

    await logAudit({
      userId: session.user.id,
      action: "UPDATE",
      entity: "ContactSubmission",
      entityId: id,
      details: `Yanıt gönderildi: ${submission.email}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reply send error:", error);
    return NextResponse.json({ error: "E-posta gönderilemedi. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
