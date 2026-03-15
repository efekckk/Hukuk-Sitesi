import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { decode } from "next-auth/jwt";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for admin routes and API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/giris")) {
      // JWT token'ı decode ederek doğrula — Prisma kullanmaz, Edge uyumlu
      const secret = process.env.AUTH_SECRET;
      const token =
        request.cookies.get("authjs.session-token")?.value ||
        request.cookies.get("__Secure-authjs.session-token")?.value;

      if (!token || !secret) {
        return NextResponse.redirect(new URL("/admin/giris", request.url));
      }

      try {
        // next-auth v5: salt = cookie adı
        const cookieName = request.cookies.get("__Secure-authjs.session-token")
          ? "__Secure-authjs.session-token"
          : "authjs.session-token";
        const decoded = await decode({ token, secret, salt: cookieName });
        if (!decoded?.sub && !(decoded as Record<string, unknown>)?.id) {
          return NextResponse.redirect(new URL("/admin/giris", request.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/admin/giris", request.url));
      }
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(tr|en)/:path*",
    "/((?!api|admin|_next|_vercel|.*\\..*).*)",
  ],
};
