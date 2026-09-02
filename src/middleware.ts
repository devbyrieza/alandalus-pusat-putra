import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Detect if visiting via PPDB Subdomain (e.g. ppdb.pesantren-alandalus-putra.com)
  const isPpdbSubdomain = host.startsWith("ppdb.");

  // List of EXCLUSIVE PPDB routes
  const ppdbRoutes = ["/ppdb", "/daftar", "/login", "/dashboard", "/verifikasi-otp", "/send-otp", "/daftar-pindahan", "/daftar-sukses"];
  const isPpdbRoute = ppdbRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (isPpdbSubdomain) {
    // If visiting the root "/" on ppdb subdomain, rewrite to PPDB Portal (/ppdb)
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/ppdb";
      return NextResponse.rewrite(url);
    }
    
    // If they explicitly visit /ppdb on the subdomain, redirect to / to keep URL clean
    if (pathname === "/ppdb") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    
    // If on PPDB subdomain but accessing a Main Domain route (like /program, /galeri), redirect to main domain
    if (!isPpdbRoute && pathname !== "/" && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      const url = request.nextUrl.clone();
      url.host = host.replace("ppdb.", "");
      url.port = "";
      return NextResponse.redirect(url);
    }
  } else {
    // If on main domain and accessing an EXCLUSIVE PPDB route, force redirect to subdomain
    if (isPpdbRoute && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      const url = request.nextUrl.clone();
      const newHost = `ppdb.${host.replace("www.", "")}`;
      url.host = newHost;
      url.port = "";
      
      // If accessing /ppdb on main domain, remove it so it goes to root of subdomain
      if (pathname === "/ppdb") {
        url.pathname = "/";
      }
      
      return NextResponse.redirect(url);
    }
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
  ] };

