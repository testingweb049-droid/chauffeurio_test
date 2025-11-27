import { randomBytes } from "crypto";

/**
 * Generate a secure session token
 * This is Edge-compatible (no bcrypt dependency)
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

