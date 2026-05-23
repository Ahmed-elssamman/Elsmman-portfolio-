import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";

const ADMIN_ROOT = "/admin/27348";
const LOGIN_PATH = `${ADMIN_ROOT}/login`;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public admin paths: login page + login API
  if (pathname === LOGIN_PATH) return NextResponse.next();
  if (pathname === "/api/admin/login") return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifySessionToken(token);

  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/admin/")) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // Anything else under /admin/27348 → redirect to login
  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/27348/:path*", "/api/admin/:path*"],
};
