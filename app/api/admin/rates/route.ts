import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { pricingRates } from "@/db/schema";
import { validateApiRequest } from "@/lib/auth/api-auth";
import { createPricingRateSchema, updatePricingRateSchema } from "@/lib/validations/rates";
import { eq } from "drizzle-orm";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

/**
 * GET /api/admin/rates
 * Get all pricing rates
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await validateApiRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const rates = await db.select().from(pricingRates).orderBy(pricingRates.category);

    return NextResponse.json({
      success: true,
      data: rates,
    });
  } catch (error) {
    console.error("Get rates error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching rates",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/rates
 * Create a new pricing rate
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await validateApiRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = createPricingRateSchema.safeParse(body);

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

    const { category, pricing_structure } = validationResult.data;

    // Check if category already exists
    const existing = await db
      .select()
      .from(pricingRates)
      .where(eq(pricingRates.category, category))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Pricing rate for this category already exists",
        },
        { status: 400 }
      );
    }

    const [newRate] = await db
      .insert(pricingRates)
      .values({
        category,
        pricing_structure: pricing_structure as any,
        is_active: true,
      })
      .returning();

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "CREATE_RATE",
      "pricing_rates",
      `Created rate for category: ${category}`,
      ipAddress
    );

    return NextResponse.json({
      success: true,
      data: newRate,
      message: "Pricing rate created successfully",
    });
  } catch (error) {
    console.error("Create rate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while creating pricing rate",
      },
      { status: 500 }
    );
  }
}

