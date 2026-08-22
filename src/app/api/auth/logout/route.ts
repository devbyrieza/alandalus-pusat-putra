import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil",
  });

  const host = request.headers.get("host") || "";
  let baseDomain = "";
  if (host.includes("pesantren-alandalus-putra.com")) {
    baseDomain = "pesantren-alandalus-putra.com";
  } else if (host.includes("pesantren-alandalus-putri.com")) {
    baseDomain = "pesantren-alandalus-putri.com";
  } else if (host.includes("alandalus-ululalbaab.com")) {
    baseDomain = "alandalus-ululalbaab.com";
  } else if (host.includes("pesantren-alimam.com")) {
    baseDomain = "pesantren-alimam.com";
  }

  if (baseDomain) {
    response.cookies.delete({ name: "app_session", domain: baseDomain, path: "/" });
    response.cookies.delete({ name: "siakad_session", domain: baseDomain, path: "/" });
    response.cookies.delete({ name: "ppdb_session", domain: baseDomain, path: "/" });
  } else {
    response.cookies.delete({ name: "app_session", path: "/" });
    response.cookies.delete({ name: "siakad_session", path: "/" });
    response.cookies.delete({ name: "ppdb_session", path: "/" });
  }

  return response;
}
