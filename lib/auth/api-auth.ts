import { NextRequest } from "next/server";
import { getAdminCookie } from "./cookies";
import { validateAdminSession } from "./session";

/**
 * Validate admin session from API request
 * Returns admin info if valid, null otherwise
 */
export async function validateApiRequest(
  request: NextRequest
): Promise<{ adminId: string; email: string; name: string } | null> {
  const token = getAdminCookie(request);
  
  if (!token) {
    return null;
  }

  return validateAdminSession(token);
}

