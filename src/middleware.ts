import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for admin routes and API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/giris")) {
      const token =
        request.cookies.get("authjs.session-token")?.value ||
        request.cookies.get("__Secure-authjs.session-token")?.value;
      if (!token) {
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
