import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { validateApiRequest } from "@/lib/auth/api-auth";
import { sql, gte, desc } from "drizzle-orm";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

/**
 * GET /api/admin/analytics
 * Get dashboard statistics and analytics
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

    // Get date ranges
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now);
    monthStart.setMonth(monthStart.getMonth() - 1);

    // Total orders
    const totalOrdersResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(orders);
    const totalOrders = totalOrdersResult[0]?.count || 0;

    // Orders today
    const todayOrdersResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(orders)
      .where(gte(orders.created_at, todayStart));
    const todayOrders = todayOrdersResult[0]?.count || 0;

    // Orders this week
    const weekOrdersResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(orders)
      .where(gte(orders.created_at, weekStart));
    const weekOrders = weekOrdersResult[0]?.count || 0;

    // Orders this month
    const monthOrdersResult = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(orders)
      .where(gte(orders.created_at, monthStart));
    const monthOrders = monthOrdersResult[0]?.count || 0;

    // Orders by status
    const ordersByStatusResult = await db
      .select({
        status: orders.payment_status,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(orders)
      .groupBy(orders.payment_status);
    const ordersByStatus = ordersByStatusResult.reduce(
      (acc, item) => {
        acc[item.status] = item.count;
        return acc;
      },
      {} as Record<string, number>
    );

    // Total revenue (sum of all paid orders)
    const revenueResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${orders.price} AS DECIMAL)), 0)::decimal`,
      })
      .from(orders)
      .where(sql`${orders.payment_status} = 'paid'`);
    const totalRevenue = parseFloat(revenueResult[0]?.total?.toString() || "0");

    // Revenue today
    const todayRevenueResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${orders.price} AS DECIMAL)), 0)::decimal`,
      })
      .from(orders)
      .where(
        sql`${orders.payment_status} = 'paid' AND ${orders.created_at} >= ${todayStart}`
      );
    const todayRevenue = parseFloat(
      todayRevenueResult[0]?.total?.toString() || "0"
    );

    // Revenue this month
    const monthRevenueResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${orders.price} AS DECIMAL)), 0)::decimal`,
      })
      .from(orders)
      .where(
        sql`${orders.payment_status} = 'paid' AND ${orders.created_at} >= ${monthStart}`
      );
    const monthRevenue = parseFloat(
      monthRevenueResult[0]?.total?.toString() || "0"
    );

    // Recent orders (last 10)
    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.created_at))
      .limit(10);

    // Recent activity logs removed - not needed in dashboard

    // Unique users count
    const uniqueUsersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${orders.email})::int`,
      })
      .from(orders);
    const uniqueUsers = uniqueUsersResult[0]?.count || 0;

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "VIEW_ANALYTICS",
      "analytics",
      "Viewed dashboard analytics",
      ipAddress
    );

    return NextResponse.json({
      success: true,
      data: {
        orders: {
          total: totalOrders,
          today: todayOrders,
          thisWeek: weekOrders,
          thisMonth: monthOrders,
          byStatus: ordersByStatus,
        },
        revenue: {
          total: totalRevenue,
          today: todayRevenue,
          thisMonth: monthRevenue,
        },
        users: {
          unique: uniqueUsers,
        },
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          email: order.email,
          name: order.name,
          price: order.price,
          payment_status: order.payment_status,
          created_at: order.created_at,
        })),
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching analytics",
      },
      { status: 500 }
    );
  }
}

