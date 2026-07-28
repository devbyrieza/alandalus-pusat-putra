import { NextResponse, type NextRequest } from "next/server";

// DUMMY MIDDLEWARE
// Vercel Gateway mem-cache rute middleware lama sehingga mengembalikan 404 jika file ini dihapus.
// Karenanya, kita berikan middleware kosong ini agar Vercel merespons 200 OK.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
