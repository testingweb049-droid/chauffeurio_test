"use client";

import { Column } from "@/component/admin/DataTable";
import { format } from "date-fns";
import { Button } from "@/component/ui/button";
import { Eye, Edit } from "lucide-react";

interface Order {
  id: string;
  email: string;
  name: string;
  phone: string;
  category: string;
  price: string;
  car: string;
  pickup_location: string;
  dropoff_location: string;
  payment_status: string;
  payment_method: string | null;
  created_at: Date;
}

interface OrdersColumnsProps {
  onViewOrder: (orderId: string) => void;
  onEditOrder: (order: Order) => void;
}

export function getOrdersColumns({
  onViewOrder,
  onEditOrder,
}: OrdersColumnsProps): Column<Order>[] {
  return [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: (row) => (
        <span className="font-mono text-xs">{row.id.slice(0, 8)}...</span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "car",
      header: "Car",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (row) => `€${row.price}`,
    },
    {
      accessorKey: "payment_status",
      header: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.payment_status === "paid"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : row.payment_status === "pending"
              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          }`}
        >
          {row.payment_status}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: (row) => format(new Date(row.created_at), "MMM d, yyyy"),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewOrder(row.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditOrder(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}

export type { Order };

