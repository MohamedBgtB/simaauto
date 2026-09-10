import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "sima_admin_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!pathname.startsWith("/admin") && !isAdminApi) return NextResponse.next();
  if (isLoginPage) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;

  let authed = false;
  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      authed = true;
    } catch {
      authed = false;
    }
  }

  if (!authed) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
