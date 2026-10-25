import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const adminCookie = request.cookies.get("pim_sumon_admin")?.value;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (
      !adminCookie ||
      !sessionSecret ||
      adminCookie !== sessionSecret
    ) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};