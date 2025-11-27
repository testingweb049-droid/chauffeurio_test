import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { validateApiRequest } from "@/lib/auth/api-auth";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

/**
 * GET /api/admin/users/[id]
 * Get user details by email (email is used as identifier from orders)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate admin session
    const admin = await validateApiRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    // Get user orders and aggregate data
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.email, decodedId))
      .orderBy(sql`${orders.created_at} DESC`);

    if (userOrders.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Aggregate user data
    const userData = {
      email: userOrders[0].email,
      name: userOrders[0].name,
      phone: userOrders[0].phone,
      total_orders: userOrders.length,
      orders: userOrders.map((order) => ({
        id: order.id,
        category: order.category,
        price: order.price,
        car: order.car,
        pickup_location: order.pickup_location,
        dropoff_location: order.dropoff_location,
        pickup_date: order.pickup_date,
        payment_status: order.payment_status,
        created_at: order.created_at,
      })),
    };

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "VIEW_USER",
      "users",
      `Viewed user: ${decodedId}`,
      ipAddress
    );

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching user",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete all orders for a user (by email)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate admin session
    const admin = await validateApiRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    // Delete all orders for this user
    const deletedOrders = await db
      .delete(orders)
      .where(eq(orders.email, decodedId))
      .returning();

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "DELETE_USER_ORDERS",
      "users",
      `Deleted ${deletedOrders.length} orders for user: ${decodedId}`,
      ipAddress
    );

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedOrders.length} order(s) for user`,
      data: { deletedCount: deletedOrders.length },
    });
  } catch (error) {
    console.error("Delete user orders error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while deleting user orders",
      },
      { status: 500 }
    );
  }
}

