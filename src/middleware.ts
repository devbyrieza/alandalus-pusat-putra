import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Detect if visiting via PPDB Subdomain (e.g. ppdb.pesantren-alandalus-putra.com)
  const isPpdbSubdomain = host.startsWith("ppdb.");

  // If visiting the root "/" on ppdb subdomain, direct them straight to PPDB Portal (/ppdb or /daftar)
  if (isPpdbSubdomain && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/ppdb";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)",
  ],
};
