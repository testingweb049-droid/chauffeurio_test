"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/component/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/component/ui/dialog";
import { DataTable } from "@/component/admin/DataTable";
import { getUsersColumns } from "@/component/admin/columns";
import { ApiResponse, PaginatedResponse, UserFromOrders } from "@/types/admin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<UserFromOrders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const result: ApiResponse<PaginatedResponse<UserFromOrders>> =
        await response.json();

      if (result.success && result.data) {
        setUsers(result.data.data);
        setTotalPages(result.data.pagination.totalPages);
        setTotal(result.data.pagination.total);
      } else {
        toast.error(result.error || "Failed to load users");
      }
    } catch (error) {
      console.error("Users error:", error);
      toast.error("An error occurred while loading users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = async (email: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        toast.success(result.message || "User orders deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error(result.error || "Failed to delete user orders");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting user orders");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewUser = useCallback((email: string) => {
    router.push(`/admin/users/${encodeURIComponent(email)}`);
  }, [router]);

  const handleDeleteClick = useCallback((email: string) => {
    setSelectedUser(email);
    setIsDeleteDialogOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getUsersColumns({
        onViewUser: handleViewUser,
        onDeleteUser: handleDeleteClick,
      }),
    [handleViewUser, handleDeleteClick]
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Users Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and view all users from orders
        </p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        title="Users"
        searchable
        searchPlaceholder="Search users..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
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
        emptyMessage="No users found"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User Orders</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all orders for{" "}
              <strong>{selectedUser}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleDelete(selectedUser)}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

