import { NextResponse, type NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";

/**
 * Optimistic auth check only — it reads and verifies the signed session cookie
 * and never touches the database, because this runs on every request including
 * prefetches. The real authorization happens per-query via src/lib/dal.ts.
 */
const MARKETING_PAGES = ["/features", "/privacy"];

const PUBLIC_FILES = [
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/opengraph-image",
  "/twitter-image",
];

export async function proxy(request: NextRequest) {
  const session = await decrypt(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname === "/" ||
    MARKETING_PAGES.includes(pathname) ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    // Crawler and share-card files must never bounce to the login page.
    PUBLIC_FILES.some((f) => pathname.startsWith(f));

  if (!session && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session && (pathname === "/login" || pathname === "/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
