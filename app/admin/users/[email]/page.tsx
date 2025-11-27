"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/component/ui/table";
import { Button } from "@/component/ui/button";
import { ArrowLeft } from "lucide-react";
import { ApiResponse } from "@/types/admin";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface UserDetail {
  email: string;
  name: string;
  phone: string;
  total_orders: number;
  orders: Array<{
    id: string;
    category: string;
    price: string;
    car: string;
    pickup_location: string;
    dropoff_location: string;
    pickup_date: Date | null;
    payment_status: string;
    created_at: Date;
  }>;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const email = decodeURIComponent(params.email as string);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `/api/admin/users/${encodeURIComponent(email)}`
        );
        const result: ApiResponse<UserDetail> = await response.json();

        if (result.success && result.data) {
          setUserData(result.data);
        } else {
          toast.error(result.error || "Failed to load user");
          router.push("/admin/users");
        }
      } catch (error) {
        console.error("User detail error:", error);
        toast.error("An error occurred while loading user");
        router.push("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [email, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-muted-foreground">{userData.email}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{userData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{userData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="font-medium">{userData.total_orders}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Dropoff</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                userData.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{order.category}</TableCell>
                    <TableCell>{order.car}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {order.pickup_location}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {order.dropoff_location}
                    </TableCell>
                    <TableCell>€{order.price}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

