import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Set admin session cookie
 */
export function setAdminCookie(
  token: string,
  response: NextResponse
): NextResponse {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}

/**
 * Get admin session cookie from request
 */
export function getAdminCookie(request: NextRequest): string | null {
  return request.cookies.get(ADMIN_SESSION_COOKIE)?.value || null;
}

/**
 * Clear admin session cookie
 */
export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}

