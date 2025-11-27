import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/admin-auth";
import { adminRegisterSchema } from "@/lib/validations/admin";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

/**
 * Manual admin registration endpoint (for Postman use only)
 * In production, consider adding additional security measures
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = adminRegisterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validationResult.data;

    // Check if admin with email already exists
    const existingAdmin = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase()))
      .limit(1);

    if (existingAdmin.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create admin
    const [newAdmin] = await db
      .insert(admins)
      .values({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        is_active: true,
      })
      .returning();

    // Log admin creation
    const ipAddress = getClientIp(request);
    await logAdminAction(
      newAdmin.id,
      "CREATE_ADMIN",
      "admin",
      `Created admin: ${newAdmin.email}`,
      ipAddress
    );

    return NextResponse.json(
      {
        success: true,
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
          name: newAdmin.name,
        },
        message: "Admin created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during registration",
      },
      { status: 500 }
    );
  }
}

