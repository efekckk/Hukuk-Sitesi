import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserRole, canAccess } from "@/lib/permissions";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileTypeFromBuffer } from "file-type";

// Sadece izin verilen MIME type → uzantı eşlemeleri
const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png":  ".png",
  "image/webp": ".webp",
  "image/gif":  ".gif",
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const role = await getUserRole(session.user.id);
    if (!role || !canAccess(role, "upload")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 5MB'dan küçük olmalıdır." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic bytes ile gerçek dosya türünü tespit et (client header'ına güvenme)
    const detected = await fileTypeFromBuffer(buffer);

    if (!detected || !(detected.mime in ALLOWED_MIME_TO_EXT)) {
      return NextResponse.json(
        { error: "Desteklenmeyen dosya formatı. JPEG, PNG, WebP veya GIF yükleyiniz." },
        { status: 400 }
      );
    }

    // Uzantıyı güvenilir MIME'dan al — asla client'tan gelen dosya adından değil
    const ext = ALLOWED_MIME_TO_EXT[detected.mime];
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // Uploads dizinini oluştur
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Path traversal koruması: filename'in uploads dışına çıkmadığını doğrula
    const filepath = path.join(uploadDir, filename);
    if (!filepath.startsWith(uploadDir)) {
      return NextResponse.json({ error: "Geçersiz dosya adı" }, { status: 400 });
    }

    await writeFile(filepath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Yükleme hatası" }, { status: 500 });
  }
}
