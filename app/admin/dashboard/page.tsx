"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/component/admin/StatsCard";
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/component/ui/table";
import { ApiResponse } from "@/types/admin";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface AnalyticsData {
  orders: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byStatus: Record<string, number>;
  };
  revenue: {
    total: number;
    today: number;
    thisMonth: number;
  };
  users: {
    unique: number;
  };
  recentOrders: Array<{
    id: string;
    email: string;
    name: string;
    price: string;
    payment_status: string;
    created_at: Date;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics");
        const result: ApiResponse<AnalyticsData> = await response.json();

        if (result.success && result.data) {
          setData(result.data);
        } else {
          toast.error(result.error || "Failed to load analytics");
        }
      } catch (error) {
        console.error("Analytics error:", error);
        toast.error("An error occurred while loading analytics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value={data.orders.total}
          icon={ShoppingBag}
          change={{
            value: data.orders.today,
            label: "today",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Total Revenue"
          value={`€${parseFloat(data.revenue.total.toString()).toFixed(2)}`}
          icon={DollarSign}
          change={{
            value: data.revenue.today,
            label: "today",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Unique Users"
          value={data.users.unique}
          icon={Users}
        />
        <StatsCard
          title="This Month"
          value={data.orders.thisMonth}
          icon={TrendingUp}
          change={{
            value: data.orders.thisMonth - data.orders.thisWeek,
            label: "vs last week",
            isPositive:
              data.orders.thisMonth - data.orders.thisWeek >= 0,
          }}
        />
      </div>
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No recent orders
                  </TableCell>
                </TableRow>
              ) : (
                data.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.name}
                    </TableCell>
                    <TableCell>€{order.price}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.payment_status === "paid"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : order.payment_status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
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

