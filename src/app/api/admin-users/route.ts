import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { getUserRole, canAccess } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const users = await prisma.adminUser.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.id);
    if (!userRole || !canAccess(userRole, "admin-users")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    // Only SUPER_ADMIN can create new users
    const currentUser = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (currentUser?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Bu işlem için süper admin yetkisi gereklidir" }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, password, role } = body;

    if (!email?.trim() || !name?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "E-posta, ad ve şifre zorunludur" }, { status: 400 });
    }

    // Domain kısıtlaması: sadece @aebhukuk.com uzantılı mailler eklenebilir
    if (!email.trim().toLowerCase().endsWith("@aebhukuk.com")) {
      return NextResponse.json({ error: "Sadece @aebhukuk.com uzantılı e-posta adresleri eklenebilir" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır" }, { status: 400 });
    }

    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.adminUser.create({
      data: {
        email: email.trim(),
        name: name.trim(),
        passwordHash,
        role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "EDITOR",
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    await logAudit({ userId: session.user.id, action: "CREATE", entity: "AdminUser", entityId: user.id, details: email });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Admin user create error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.id);
    if (!userRole || !canAccess(userRole, "admin-users")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, role, currentPassword, newPassword } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    // Users can only edit themselves; SUPER_ADMIN can edit anyone
    const currentUser = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
    const isSelf = session.user.id === id;

    if (!isSuperAdmin && !isSelf) {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};

    if (name?.trim()) updateData.name = name.trim();
    if (role && isSuperAdmin) {
      updateData.role = role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "EDITOR";
    }

    // Password change
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "Yeni şifre en az 8 karakter olmalıdır" }, { status: 400 });
      }
      if (isSelf && !isSuperAdmin) {
        // Verify current password for self-service
        if (!currentPassword) {
          return NextResponse.json({ error: "Mevcut şifre gereklidir" }, { status: 400 });
        }
        const user = await prisma.adminUser.findUnique({ where: { id } });
        const valid = user && await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) {
          return NextResponse.json({ error: "Mevcut şifre yanlış" }, { status: 400 });
        }
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    await logAudit({ userId: session.user.id, action: "UPDATE", entity: "AdminUser", entityId: id, details: user.name });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const userRole = await getUserRole(session.user.id);
    if (!userRole || !canAccess(userRole, "admin-users")) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const currentUser = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (currentUser?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Bu işlem için süper admin yetkisi gereklidir" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    if (id === session.user.id) {
      return NextResponse.json({ error: "Kendi hesabınızı silemezsiniz" }, { status: 400 });
    }

    // Check if this is the last SUPER_ADMIN
    const superAdmins = await prisma.adminUser.count({ where: { role: "SUPER_ADMIN" } });
    const targetUser = await prisma.adminUser.findUnique({ where: { id }, select: { role: true } });
    if (targetUser?.role === "SUPER_ADMIN" && superAdmins <= 1) {
      return NextResponse.json({ error: "En az bir süper admin olmalıdır" }, { status: 400 });
    }

    await prisma.adminUser.delete({ where: { id } });

    await logAudit({ userId: session.user.id, action: "DELETE", entity: "AdminUser", entityId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
