import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil",
  });

  // Clear auth session cookie
  
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  
  // Clean up domain-wide cookies
  if (domain) {
    response.headers.append("Set-Cookie", `app_session=; Path=/; Max-Age=0; Domain=${domain}`);
    response.headers.append("Set-Cookie", `siakad_session=; Path=/; Max-Age=0; Domain=${domain}`);
    response.headers.append("Set-Cookie", `ppdb_session=; Path=/; Max-Age=0; Domain=${domain}`);
  }

  // Clean up subdomain/host-specific cookies
  response.headers.append("Set-Cookie", "app_session=; Path=/; Max-Age=0");
  response.headers.append("Set-Cookie", "siakad_session=; Path=/; Max-Age=0");
  response.headers.append("Set-Cookie", "ppdb_session=; Path=/; Max-Age=0");

  return response;
}
