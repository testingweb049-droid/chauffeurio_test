import { NextRequest, NextResponse } from "next/server";
import { getAdminCookie } from "@/lib/auth/cookies";
import { deleteAdminSession, validateAdminSession } from "@/lib/auth/session";
import { clearAdminCookie } from "@/lib/auth/cookies";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

export async function POST(request: NextRequest) {
  try {
    const token = getAdminCookie(request);

    if (token) {
      // Get admin info before deleting session
      const session = await validateAdminSession(token);
      
      // Delete session
      await deleteAdminSession(token);

      // Log logout action
      if (session) {
        const ipAddress = getClientIp(request);
        await logAdminAction(session.adminId, "LOGOUT", "auth", null, ipAddress);
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    return clearAdminCookie(response);
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during logout",
      },
      { status: 500 }
    );
  }
}

