import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { pricingRates } from "@/db/schema";
import { validateApiRequest } from "@/lib/auth/api-auth";
import { updatePricingRateSchema } from "@/lib/validations/rates";
import { eq } from "drizzle-orm";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

/**
 * GET /api/admin/rates/[category]
 * Get pricing rate for a specific category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const admin = await validateApiRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { category: categoryParam } = await params;
    const category = decodeURIComponent(categoryParam);

    const [rate] = await db
      .select()
      .from(pricingRates)
      .where(eq(pricingRates.category, category))
      .limit(1);

    if (!rate) {
      return NextResponse.json(
        {
          success: false,
          error: "Pricing rate not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rate,
    });
  } catch (error) {
    console.error("Get rate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching pricing rate",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/rates/[category]
 * Update pricing rate for a specific category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const admin = await validateApiRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { category: categoryParam } = await params;
    const category = decodeURIComponent(categoryParam);
    const body = await request.json();
    const validationResult = updatePricingRateSchema.safeParse(body);

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

    const { pricing_structure, is_active } = validationResult.data;

    // Check if rate exists
    const [existing] = await db
      .select()
      .from(pricingRates)
      .where(eq(pricingRates.category, category))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Pricing rate not found",
        },
        { status: 404 }
      );
    }

    // Update rate
    const updateData: any = {
      updated_at: new Date(),
    };

    if (pricing_structure !== undefined) {
      updateData.pricing_structure = pricing_structure;
    }

    if (is_active !== undefined) {
      updateData.is_active = is_active;
    }

    const [updatedRate] = await db
      .update(pricingRates)
      .set(updateData)
      .where(eq(pricingRates.category, category))
      .returning();

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "UPDATE_RATE",
      "pricing_rates",
      `Updated rate for category: ${category}`,
      ipAddress
    );

    return NextResponse.json({
      success: true,
      data: updatedRate,
      message: "Pricing rate updated successfully",
    });
  } catch (error) {
    console.error("Update rate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while updating pricing rate",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/rates/[category]
 * Delete pricing rate for a specific category
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const admin = await validateApiRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { category: categoryParam } = await params;
    const category = decodeURIComponent(categoryParam);

    const [deleted] = await db
      .delete(pricingRates)
      .where(eq(pricingRates.category, category))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Pricing rate not found",
        },
        { status: 404 }
      );
    }

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "DELETE_RATE",
      "pricing_rates",
      `Deleted rate for category: ${category}`,
      ipAddress
    );

    return NextResponse.json({
      success: true,
      message: "Pricing rate deleted successfully",
    });
  } catch (error) {
    console.error("Delete rate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while deleting pricing rate",
      },
      { status: 500 }
    );
  }
}

