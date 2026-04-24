import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readAdminSessionFromRequest } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname === "/admin/forgot-password") return NextResponse.next();
  if (pathname === "/admin/reset-password") return NextResponse.next();

  const userId = await readAdminSessionFromRequest(req);
  if (userId) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"]
};

