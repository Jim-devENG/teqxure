import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "teqxure_session";

// Dedicated subdomains: admin.teqxure.xyz is the Super Admin CMS,
// app.teqxure.xyz is the student/staff Engineering Workspace. Both live in
// the same Next.js deployment as www.teqxure.xyz, under the real /admin and
// /platform route trees — but every link, redirect, and email generated for
// these sections uses clean, host-relative paths (e.g. "/dashboard", not
// "/platform/dashboard"). This middleware is what makes that work: it
// transparently prefixes incoming requests on the dedicated host with the
// real internal route, and redirects anyone hitting the old /admin or
// /platform paths on another host over to the correct subdomain.
const ADMIN_HOST = "admin.teqxure.xyz";
const APP_HOST = "app.teqxure.xyz";
// events.teqxure.xyz is public (no auth guard) and maps onto the real
// /events route tree, exactly like the pattern above — except its legacy
// path (the old /events on the main site) must NOT be redirected away from
// admin.teqxure.xyz, since /events there is a completely different feature
// (the CMS's event management pages), not the public events site.
const EVENTS_HOST = "events.teqxure.xyz";

const PUBLIC_ADMIN_PATHS = ["/login"];
const PUBLIC_APP_PATHS = ["/login", "/set-password"];

function isAsset(pathname: string): boolean {
  return pathname.startsWith("/_next") || pathname.startsWith("/api") || /\.[a-zA-Z0-9]+$/.test(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host")?.split(":")[0].toLowerCase() ?? "";

  if (isAsset(pathname)) {
    return NextResponse.next();
  }

  // Legacy /admin and /platform paths on any other host (old bookmarks,
  // already-sent invite emails, etc.) redirect to the dedicated subdomain
  // with the prefix stripped, so nothing breaks.
  if (host !== ADMIN_HOST && pathname.startsWith("/admin")) {
    const url = new URL((pathname.slice("/admin".length) || "/") + search, `https://${ADMIN_HOST}`);
    return NextResponse.redirect(url);
  }
  if (host !== APP_HOST && pathname.startsWith("/platform")) {
    const url = new URL((pathname.slice("/platform".length) || "/") + search, `https://${APP_HOST}`);
    return NextResponse.redirect(url);
  }
  // Deliberately excludes ADMIN_HOST/APP_HOST — /events under those hosts is
  // an unrelated feature (event management, not the public events site).
  if (host !== EVENTS_HOST && host !== ADMIN_HOST && host !== APP_HOST && pathname.startsWith("/events")) {
    const url = new URL((pathname.slice("/events".length) || "/") + search, `https://${EVENTS_HOST}`);
    return NextResponse.redirect(url);
  }

  if (host === ADMIN_HOST) {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!PUBLIC_ADMIN_PATHS.includes(pathname) && !hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.rewrite(new URL(`/admin${pathname === "/" ? "" : pathname}`, request.url));
  }

  if (host === APP_HOST) {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!PUBLIC_APP_PATHS.includes(pathname) && !hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.rewrite(new URL(`/platform${pathname === "/" ? "" : pathname}`, request.url));
  }

  if (host === EVENTS_HOST) {
    return NextResponse.rewrite(new URL(`/events${pathname === "/" ? "" : pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
