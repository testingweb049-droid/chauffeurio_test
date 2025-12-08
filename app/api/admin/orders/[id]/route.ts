import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateApiRequest } from "@/lib/auth/api-auth";
import { updateOrderSchema } from "@/lib/validations/admin";
import { logAdminAction, getClientIp } from "@/lib/auth/admin-logs";

/**
 * GET /api/admin/orders/[id]
 * Get order details by ID
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

    // Get order
    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (orderResult.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "VIEW_ORDER",
      "orders",
      `Viewed order: ${id}`,
      ipAddress
    );

    return NextResponse.json({
      success: true,
      data: orderResult[0],
    });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching order",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/orders/[id]
 * Update order (mainly status)
 */
export async function PUT(
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
    const body = await request.json();

    // Validate input
    const validationResult = updateOrderSchema.safeParse(body);
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

    // Check if order exists
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order
    const updateData: any = {
      updated_at: new Date(),
    };

    if (validationResult.data.payment_status) {
      updateData.payment_status = validationResult.data.payment_status;
    }
    if (validationResult.data.payment_method) {
      updateData.payment_method = validationResult.data.payment_method;
    }
    if (validationResult.data.payment_id) {
      updateData.payment_id = validationResult.data.payment_id;
    }

    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    // Log action
    const ipAddress = getClientIp(request);
    await logAdminAction(
      admin.adminId,
      "UPDATE_ORDER",
      "orders",
      `Updated order ${id}: ${JSON.stringify(updateData)}`,
      ipAddress
    );

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while updating order",
      },
      { status: 500 }
    );
  }
}

