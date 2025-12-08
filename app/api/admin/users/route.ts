import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { validateApiRequest } from "@/lib/auth/api-auth";
import { paginationSchema } from "@/lib/validations/admin";
import { sql } from "drizzle-orm";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

/**
 * GET /api/admin/users
 * List all unique users from orders table
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
    const validationResult = paginationSchema.safeParse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid pagination parameters",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { page, limit } = validationResult.data;
    const offset = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    // Build base query conditions
    const searchCondition = search
      ? sql`${orders.email} ILIKE ${`%${search}%`} OR ${orders.name} ILIKE ${`%${search}%`} OR ${orders.phone} ILIKE ${`%${search}%`}`
      : undefined;

    // Get total count with search filter
    const totalQuery = db
      .select({ count: sql<number>`COUNT(DISTINCT ${orders.email})::int` })
      .from(orders);
    
    const totalResult = searchCondition
      ? await totalQuery.where(searchCondition)
      : await totalQuery;

    const total = totalResult[0]?.count || 0;

    // Build query to get unique users from orders
    const baseQuery = db
      .select({
        email: orders.email,
        name: orders.name,
        phone: orders.phone,
        total_orders: sql<number>`COUNT(*)::int`,
        last_order_date: sql<Date>`MAX(${orders.created_at})`,
      })
      .from(orders);

    // Apply search filter first (before groupBy), then groupBy
    const queryWithWhere = searchCondition 
      ? baseQuery.where(searchCondition)
      : baseQuery;
    
    const query = queryWithWhere.groupBy(orders.email, orders.name, orders.phone);

    // Get paginated results
    const users = await query.limit(limit).offset(offset);

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "VIEW_USERS",
      "users",
      `Page ${page}, Limit ${limit}`,
      ipAddress
    );

    return NextResponse.json({
      success: true,
      data: {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching users",
      },
      { status: 500 }
    );
  }
}

