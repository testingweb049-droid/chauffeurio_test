import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { validateApiRequest } from "@/lib/auth/api-auth";
import { orderFilterSchema } from "@/lib/validations/admin";
import { eq, and, gte, lte, or, ilike, sql } from "drizzle-orm";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

/**
 * GET /api/admin/orders
 * List all orders with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Validate admin session
    const admin = await validateApiRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const validationResult = orderFilterSchema.safeParse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      status: searchParams.get("status") || undefined,
      start_date: searchParams.get("start_date") || undefined,
      end_date: searchParams.get("end_date") || undefined,
      search: searchParams.get("search") || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid filter parameters",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { page, limit, status, start_date, end_date, search } =
      validationResult.data;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(orders.payment_status, status));
    }

    if (start_date) {
      conditions.push(gte(orders.created_at, new Date(start_date)));
    }

    if (end_date) {
      conditions.push(lte(orders.created_at, new Date(end_date)));
    }

    if (search) {
      conditions.push(
        or(
          ilike(orders.email, `%${search}%`),
          ilike(orders.name, `%${search}%`),
          ilike(orders.phone, `%${search}%`),
          ilike(orders.pickup_location, `%${search}%`),
          ilike(orders.dropoff_location, `%${search}%`)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(orders)
      .where(whereClause);

    const total = totalResult[0]?.count || 0;

    // Get paginated results
    const ordersList = await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(sql`${orders.created_at} DESC`)
      .limit(limit)
      .offset(offset);

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "VIEW_ORDERS",
      "orders",
      `Page ${page}, Filters: ${JSON.stringify({ status, search })}`,
      ipAddress
    );

    return NextResponse.json({
      success: true,
      data: {
        data: ordersList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching orders",
      },
      { status: 500 }
    );
  }
}

