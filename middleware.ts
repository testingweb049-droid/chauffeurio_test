import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session_token";

/**
 * Middleware for admin route protection
 * Note: Only checks for cookie existence (Edge-compatible)
 * Full session validation happens in API routes and ProtectedRoute component
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Check if admin session cookie exists
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!token) {
      // No token, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Cookie exists, allow access
    // Full validation will happen in ProtectedRoute component (client-side)
    // and API routes (server-side)
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};

