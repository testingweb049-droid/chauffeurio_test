"use client";

import { Column } from "@/component/admin/DataTable";
import { format } from "date-fns";

interface RecentOrder {
  id: string;
  email: string;
  name: string;
  price: string;
  payment_status: string;
  created_at: Date;
}

export const dashboardRecentOrdersColumns: Column<RecentOrder>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    accessorKey: "price",
    header: "Amount",
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
    cell: (row) => (
      <span className="text-muted-foreground">
        {format(new Date(row.created_at), "MMM d, yyyy")}
      </span>
    ),
  },
];

