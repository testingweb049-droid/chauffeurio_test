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
    <div className="space-y-6 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
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
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No recent orders
                    </TableCell>
                  </TableRow>
                ) : (
                  data.recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {order.name}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-white">€{order.price}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.payment_status === "paid"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                              : order.payment_status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {format(new Date(order.created_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

