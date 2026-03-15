import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendContactEmailParams {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactNotification(params: SendContactEmailParams) {
  const { name, email, phone, subject, message } = params;

  try {
    await resend.emails.send({
      from: "AEB Avukatlık Ortaklığı <info@aebhukuk.com>",
      to: ["info@aebhukuk.com"],
      subject: `Yeni İletişim Formu: ${escapeHtml(subject)}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>Ad Soyad:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Konu:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send contact notification:", error);
  }
}

export async function sendAdminReply(params: {
  toEmail: string;
  toName: string;
  originalSubject: string;
  replyText: string;
}) {
  const { toEmail, toName, originalSubject, replyText } = params;

  try {
    await resend.emails.send({
      from: "AEB Avukatlık Ortaklığı <info@aebhukuk.com>",
      replyTo: "info@aebhukuk.com",
      to: [toEmail],
      subject: `Re: ${originalSubject}`,
      html: `<!DOCTYPE html>
<html lang="tr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>AEB Avukatlık Ortaklığı</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f5f5f3;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f3;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Kart -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;">

          <!-- Üst başlık şeridi -->
          <tr>
            <td style="background-color:#0a0a0a;padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:Georgia,serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#b8975a;">
                      AEB AVUKATLIK ORTAKLIĞI
                    </p>
                    <p style="margin:4px 0 0;font-family:Georgia,serif;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:#555555;">
                      AŞCI &bull; ETCİ &bull; BENGLİAN
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- İnce altın çizgi -->
          <tr>
            <td style="background-color:#b8975a;height:2px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- İçerik -->
          <tr>
            <td style="padding:40px 40px 32px;">

              <!-- Selamlama -->
              <p style="margin:0 0 24px;font-family:Georgia,serif;font-size:16px;color:#1a1a1a;">
                Sayın ${escapeHtml(toName)},
              </p>

              <!-- Yanıt metni -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0;font-family:Georgia,serif;font-size:15px;line-height:1.9;color:#333333;white-space:pre-wrap;">
${escapeHtml(replyText)}
                  </td>
                </tr>
              </table>

              <!-- Saygılar -->
              <p style="margin:32px 0 0;font-family:Georgia,serif;font-size:15px;color:#1a1a1a;">
                Saygılarımızla,
              </p>

            </td>
          </tr>

          <!-- İmza bölümü -->
          <tr>
            <td style="background-color:#f9f9f7;border-top:1px solid #e8e8e4;padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:Georgia,serif;font-size:13px;font-weight:bold;color:#0a0a0a;letter-spacing:0.5px;">
                      AEB Avukatlık Ortaklığı
                    </p>
                    <p style="margin:2px 0 0;font-family:Georgia,serif;font-size:11px;color:#888888;letter-spacing:1px;text-transform:uppercase;">
                      Aşcı &bull; Etci &bull; Benglian
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
                      <tr>
                        <td style="font-family:Arial,sans-serif;font-size:12px;color:#555555;line-height:1.8;">
                          <a href="tel:+902122660076" style="color:#555555;text-decoration:none;">+90 (212) 266 00 76</a>
                          &nbsp;&bull;&nbsp;
                          <a href="mailto:info@aebhukuk.com" style="color:#b8975a;text-decoration:none;">info@aebhukuk.com</a>
                          <br>
                          KEY Plaza, Merkez, İstiklal Sokağı No:11 K:3-4
                          <br>
                          34384 Şişli / İstanbul
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alt footer -->
          <tr>
            <td style="background-color:#0a0a0a;padding:14px 40px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;color:#444444;text-align:center;">
                Bu e-posta AEB Avukatlık Ortaklığı tarafından gönderilmiştir. &copy; 2025 Tüm hakları saklıdır.
              </p>
            </td>
          </tr>

        </table>
        <!-- / Kart -->

      </td>
    </tr>
  </table>
</body>
</html>`,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send admin reply:", error);
    throw error;
  }
}

export async function sendContactAutoReply(toEmail: string, name: string) {
  try {
    await resend.emails.send({
      from: "AEB Avukatlık Ortaklığı <info@aebhukuk.com>",
      replyTo: "info@aebhukuk.com",
      to: [toEmail],
      subject: "Mesajınız Alındı | AEB Avukatlık Ortaklığı",
      html: `
        <h2>Sayın ${escapeHtml(name)},</h2>
        <p>Mesajınız tarafımıza ulaşmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
        <p>Acil durumlarda bizi telefonla arayabilirsiniz: <strong>+90 (212) 266 00 76</strong></p>
        <br>
        <p>Saygılarımızla,</p>
        <p><strong>AEB Avukatlık Ortaklığı</strong></p>
      `,
    });
  } catch (error) {
    console.error("Failed to send auto-reply:", error);
  }
}
