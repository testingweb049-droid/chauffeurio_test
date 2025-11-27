import { db } from "@/db/drizzle";
import { adminSessions, admins } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { generateSessionToken } from "./token";

const SESSION_DURATION_DAYS = 7;

/**
 * Create a new admin session
 */
export async function createAdminSession(adminId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await db.insert(adminSessions).values({
    admin_id: adminId,
    token,
    expires_at: expiresAt,
  });

  return token;
}

/**
 * Validate an admin session token
 */
export async function validateAdminSession(
  token: string
): Promise<{ adminId: string; email: string; name: string } | null> {
  try {
    const session = await db
      .select({
        session: adminSessions,
        admin: admins,
      })
      .from(adminSessions)
      .innerJoin(admins, eq(adminSessions.admin_id, admins.id))
      .where(
        and(
          eq(adminSessions.token, token),
          gt(adminSessions.expires_at, new Date()),
          eq(admins.is_active, true)
        )
      )
      .limit(1);

    if (session.length === 0) {
      return null;
    }

    const { admin } = session[0];

    return {
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
    };
  } catch (error) {
    console.error("Error validating admin session:", error);
    return null;
  }
}

/**
 * Delete an admin session (logout)
 */
export async function deleteAdminSession(token: string): Promise<void> {
  await db.delete(adminSessions).where(eq(adminSessions.token, token));
}

/**
 * Clean up expired sessions (optional utility for periodic cleanup)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await db
    .delete(adminSessions)
    .where(gt(new Date(), adminSessions.expires_at));

  return result.rowCount || 0;
}

