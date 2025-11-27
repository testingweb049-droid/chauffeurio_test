import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth/admin-auth";
import { createAdminSession } from "@/lib/auth/session";
import { setAdminCookie } from "@/lib/auth/cookies";
import { adminLoginSchema } from "@/lib/validations/admin";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = adminLoginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Find admin by email
    const adminResult = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase()))
      .limit(1);

    if (adminResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const admin = adminResult[0];

    // Check if admin is active
    if (!admin.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: "Account is deactivated",
        },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Create session
    const token = await createAdminSession(admin.id);

    // Update last login
    await db
      .update(admins)
      .set({ last_login: new Date() })
      .where(eq(admins.id, admin.id));

    // Log login action
    const ipAddress = getClientIp(request);
    await logAdminAction(admin.id, "LOGIN", "auth", null, ipAddress);

    // Set cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

    return setAdminCookie(token, response);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login",
      },
      { status: 500 }
    );
  }
}

