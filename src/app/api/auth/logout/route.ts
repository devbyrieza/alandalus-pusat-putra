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
    response.headers.append("Set-Cookie", `app_session=; Path=/; Max-Age=0; Domain=${baseDomain}`);
    response.headers.append("Set-Cookie", `siakad_session=; Path=/; Max-Age=0; Domain=${baseDomain}`);
    response.headers.append("Set-Cookie", `ppdb_session=; Path=/; Max-Age=0; Domain=${baseDomain}`);
  }

  response.headers.append("Set-Cookie", "app_session=; Path=/; Max-Age=0");
  response.headers.append("Set-Cookie", "siakad_session=; Path=/; Max-Age=0");
  response.headers.append("Set-Cookie", "ppdb_session=; Path=/; Max-Age=0");

  return response;
}
