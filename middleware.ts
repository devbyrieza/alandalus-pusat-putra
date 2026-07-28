import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // MATCHER KOSONG: Memaksa Vercel Gateway mengabaikan file ini untuk seluruh rute.
  // Ini menghindari bug Vercel Edge Runtime yang selalu memunculkan MIDDLEWARE_INVOCATION_FAILED
  // saat mengakses halaman depan (root).
  matcher: ['/bypass-vercel-edge-bug-tidak-akan-pernah-dipanggil'],
};
