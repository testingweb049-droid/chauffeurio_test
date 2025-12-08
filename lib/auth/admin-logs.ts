import { db } from "@/db/drizzle";
import { adminLogs } from "@/db/schema";

/**
 * Log an admin action
 */
export async function logAdminAction(
  adminId: string | null,
  action: string,
  resource: string | null = null,
  details: string | null = null,
  ipAddress: string | null = null
): Promise<void> {
  try {
    await db.insert(adminLogs).values({
      admin_id: adminId,
      action,
      resource,
      details,
      ip_address: ipAddress,
    });
  } catch (error) {
    // Don't throw - logging failures shouldn't break the app
    console.error("Failed to log admin action:", error);
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  return realIp || null;
}

