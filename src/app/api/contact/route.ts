import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validations/contact";
import { sendContactNotification, sendContactAutoReply } from "@/lib/mail";
import { rateLimit, getIp, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getIp(request);
    const rl = rateLimit(`contact:${ip}`, RATE_LIMITS.contact);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Geçersiz form verisi", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message, kvkkConsent } = validationResult.data;

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        kvkkConsent: Boolean(kvkkConsent),
      },
    });

    // Send emails in background (don't block response)
    sendContactNotification({ name, email, phone, subject, message });
    sendContactAutoReply(email, name);

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
