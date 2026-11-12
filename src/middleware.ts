import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "humna_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const hasCookieFormat = Boolean(sessionCookie && sessionCookie.split(".").length === 3);

    // /admin root redirects appropriately
    if (pathname === "/admin" || pathname === "/admin/") {
      const target = hasCookieFormat ? "/admin/dashboard" : "/admin/login";
      const res = NextResponse.redirect(new URL(target, req.url));
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }

    // Allow /admin/login
    if (pathname === "/admin/login") {
      const res = NextResponse.next();
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }

    // All other /admin/* pages require valid session cookie format
    if (!hasCookieFormat) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }

    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
