"use client";

import { Column } from "@/component/admin/DataTable";
import { UserFromOrders } from "@/types/admin";
import { format } from "date-fns";
import { Button } from "@/component/ui/button";
import { Eye, Trash2 } from "lucide-react";

interface UsersColumnsProps {
  onViewUser: (email: string) => void;
  onDeleteUser: (email: string) => void;
}

export function getUsersColumns({
  onViewUser,
  onDeleteUser,
}: UsersColumnsProps): Column<UserFromOrders>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "total_orders",
      header: "Total Orders",
    },
    {
      accessorKey: "last_order_date",
      header: "Last Order",
      cell: (row) =>
        row.last_order_date
          ? format(new Date(row.last_order_date), "MMM d, yyyy")
          : "N/A",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewUser(row.email)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteUser(row.email)}
          >
            <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
          </Button>
        </div>
      ),
    },
  ];
}

