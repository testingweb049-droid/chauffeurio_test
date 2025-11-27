"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/component/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/component/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/component/ui/dialog";
import { DataTable } from "@/component/admin/DataTable";
import { getOrdersColumns, type Order } from "@/component/admin/columns";
import { ApiResponse, PaginatedResponse } from "@/types/admin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const router = useRouter();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) {
        params.append("search", search);
      }
      if (statusFilter) {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const result: ApiResponse<PaginatedResponse<Order>> = await response.json();

      if (result.success && result.data) {
        setOrders(result.data.data);
        setTotalPages(result.data.pagination.totalPages);
        setTotal(result.data.pagination.total);
      } else {
        toast.error(result.error || "Failed to load orders");
      }
    } catch (error) {
      console.error("Orders error:", error);
      toast.error("An error occurred while loading orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, statusFilter]);

  const handleEdit = useCallback((order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.payment_status);
    setIsEditDialogOpen(true);
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_status: editStatus,
        }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        toast.success("Order updated successfully");
        setIsEditDialogOpen(false);
        setSelectedOrder(null);
        fetchOrders();
      } else {
        toast.error(result.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating order");
    }
  };

  const handleViewOrder = useCallback((orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  }, [router]);

  const columns = useMemo(
    () =>
      getOrdersColumns({
        onViewOrder: handleViewOrder,
        onEditOrder: handleEdit,
      }),
    [handleViewOrder, handleEdit]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">
          View and manage all orders
        </p>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        isLoading={isLoading}
        title="Orders"
        searchable
        searchPlaceholder="Search orders..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? "" : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        }
        pagination={
          totalPages > 1
            ? {
                page,
                limit: 10,
                total,
                totalPages,
                onPageChange: setPage,
              }
            : undefined
        }
        emptyMessage="No orders found"
      />

      {/* Edit Status Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Update the payment status for order{" "}
              {selectedOrder?.id.slice(0, 8)}...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedOrder(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

