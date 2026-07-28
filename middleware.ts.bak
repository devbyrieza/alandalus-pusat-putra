import { NextResponse, type NextRequest } from "next/server";

function getSessionFromCookie(request: NextRequest): { role: string | null; id: string | null; } {
  const sessionCookie = request.cookies.get("app_session");
  if (!sessionCookie) return { role: null, id: null };
  try {
    const session = JSON.parse(sessionCookie.value);
    return { role: session.role || null, id: session.id || null };
  } catch { return { role: null, id: null }; }
}

export async function middleware(request: NextRequest) {
  try {
    const { role: userRole } = getSessionFromCookie(request);
    const { pathname } = request.nextUrl;
    const host = request.headers.get("host") || "";

    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("192.168.");
    
    if (!isLocalhost) {
      const isPpdbDomain = host.startsWith("ppdb.");
      const isSafinaDomain = host.startsWith("safina.") || host.startsWith("keuangan.");
      const isAppDomain = isPpdbDomain || isSafinaDomain;

      const ppdbPaths = [
        "/ppdb", "/login", "/daftar", "/daftar-pindahan", "/daftar-sukses", 
        "/dashboard", "/admin", "/auth", "/pilih-verifikasi", "/send-otp", "/verifikasi-otp"
      ];
      const isPpdbPath = ppdbPaths.some(p => pathname === p || pathname.startsWith(p + "/"));
      
      const isStaticOrApi = pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".");
      
      if (!isStaticOrApi) {
        if (isSafinaDomain) {
          if (host.startsWith("keuangan.")) {
            const redirectUrl = new URL(pathname, `https://${host.replace("keuangan.", "safina.")}`);
            redirectUrl.search = request.nextUrl.search;
            return NextResponse.redirect(redirectUrl);
          }
          if (pathname === "/") {
            const redirectUrl = new URL("/login", request.url);
            redirectUrl.search = request.nextUrl.search;
            return NextResponse.redirect(redirectUrl);
          }
        }

        if (isAppDomain && !isPpdbPath && pathname !== "/") {
          const mainDomain = host.replace("ppdb.", "").replace("safina.", "").replace("keuangan.", "");
          const redirectUrl = new URL(pathname, `https://${mainDomain}`);
          redirectUrl.search = request.nextUrl.search;
          return NextResponse.redirect(redirectUrl);
        }
        
        if (!isAppDomain && isPpdbPath) {
          const baseHost = host.replace(/^www\./, "");
          const newPathname = pathname === "/ppdb" ? "/" : pathname;
          const redirectUrl = new URL(newPathname, `https://ppdb.${baseHost}`);
          redirectUrl.search = request.nextUrl.search;
          return NextResponse.redirect(redirectUrl);
        }
        
        if (isPpdbDomain) {
          if (pathname === "/ppdb") {
            const redirectUrl = new URL("/", request.url);
            redirectUrl.search = request.nextUrl.search;
            return NextResponse.redirect(redirectUrl);
          }
          if (pathname === "/") {
            return NextResponse.rewrite(new URL("/ppdb", request.url));
          }
        }
      }
    }

    if (pathname.startsWith("/dashboard/pendaftar") && userRole !== "pendaftar") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/dashboard/admin")) {
      const allowedAdminRoles = ["admin_berkas", "admin_keuangan", "admin_super", "admin"];
      if (!allowedAdminRoles.includes(userRole || "")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    if (pathname.startsWith("/dashboard/penguji")) {
      const allowedPengujiRoles = ["penguji", "penguji_calsan", "pewawancara_calsan", "pewawancara_cawalsan", "admin_super"];
      if (!allowedPengujiRoles.includes(userRole || "")) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      if (!userRole) return NextResponse.redirect(new URL("/login", request.url));
      if (userRole === "pendaftar") return NextResponse.redirect(new URL("/dashboard/pendaftar", request.url));
      if (["admin_berkas", "admin_keuangan", "admin_super", "admin"].includes(userRole)) return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      if (["penguji", "pewawancara_calsan", "pewawancara_cawalsan"].includes(userRole)) return NextResponse.redirect(new URL("/dashboard/penguji", request.url));
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname === "/login" && userRole) {
      if (userRole === "pendaftar") return NextResponse.redirect(new URL("/dashboard/pendaftar", request.url));
      if (["admin_berkas", "admin_keuangan", "admin_super", "admin"].includes(userRole)) return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      if (["penguji", "pewawancara_calsan", "pewawancara_cawalsan"].includes(userRole)) return NextResponse.redirect(new URL("/dashboard/penguji", request.url));
    }

    if (pathname.startsWith("/daftar") && userRole === "pendaftar") {
      return NextResponse.redirect(new URL("/dashboard/pendaftar", request.url));
    }

    const response = NextResponse.next();

    const rawSessionCookie = request.cookies.get("app_session");
    if (rawSessionCookie && userRole) {
      const maxAge = 60 * 60 * 24 * 90; 
      const expires = new Date(Date.now() + maxAge * 1000);
      response.cookies.set("app_session", rawSessionCookie.value, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        expires,
      });
    }

    return response;
  } catch (error) {
    console.error("MIDDLEWARE EXCEPTION:", error);
    // FAIL-SAFE: Jika edge crash, biarkan request berlanjut (halaman tidak 500)
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
