import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { pricingRates } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/rates/[category]
 * Get pricing rate for a specific category (PUBLIC - no auth required)
 * This endpoint is used by the booking flow to calculate prices
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
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

