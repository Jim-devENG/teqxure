import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "teqxure_session";

const PUBLIC_PLATFORM_PATHS = ["/platform/login", "/platform/set-password"];

// Dedicated subdomains: admin.teqxure.xyz is the Super Admin CMS,
// app.teqxure.xyz is the student/staff Engineering Workspace. Both are the
// same Next.js deployment as www.teqxure.xyz — only the bare root needs
// rewriting so each subdomain lands on its section instead of the marketing
// homepage; every other path already works identically on any host.
const ADMIN_HOST = "admin.teqxure.xyz";
const APP_HOST = "app.teqxure.xyz";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host")?.split(":")[0].toLowerCase() ?? "";

  if (pathname === "/") {
    if (host === ADMIN_HOST) {
      return NextResponse.rewrite(new URL("/admin", request.url));
    }
    if (host === APP_HOST) {
      return NextResponse.rewrite(new URL("/platform", request.url));
    }
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (PUBLIC_PLATFORM_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/platform")) {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/platform/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/platform/:path*"],
};
