import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendContactEmailParams {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(params: SendContactEmailParams) {
  const { name, email, phone, subject, message } = params;

  try {
    await resend.emails.send({
      from: "Hukuk Bürosu <onboarding@resend.dev>",
      to: ["info@hukukburosu.com"],
      subject: `Yeni İletişim Formu: ${subject}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""}
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send contact notification:", error);
  }
}

export async function sendContactAutoReply(toEmail: string, name: string) {
  try {
    await resend.emails.send({
      from: "Hukuk Bürosu <onboarding@resend.dev>",
      to: [toEmail],
      subject: "Mesajınız Alındı | Hukuk Bürosu",
      html: `
        <h2>Sayın ${name},</h2>
        <p>Mesajınız tarafımıza ulaşmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
        <p>Acil durumlarda bizi telefonla arayabilirsiniz.</p>
        <br>
        <p>Saygılarımızla,</p>
        <p><strong>Hukuk Bürosu</strong></p>
      `,
    });
  } catch (error) {
    console.error("Failed to send auto-reply:", error);
  }
}
