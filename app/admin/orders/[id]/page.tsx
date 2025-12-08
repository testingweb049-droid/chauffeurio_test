"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { Button } from "@/component/ui/button";
import { ArrowLeft } from "lucide-react";
import { ApiResponse } from "@/types/admin";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface OrderDetail {
  id: string;
  category: string;
  price: string;
  car: string;
  distance: string | null;
  stops: string[] | null;
  pickup_date: Date | null;
  pickup_time: string | null;
  return_date: Date | null;
  return_time: string | null;
  is_return: boolean | null;
  pickup_location: string;
  dropoff_location: string | null;
  passengers: number;
  kids: number;
  bags: number;
  name: string;
  email: string;
  phone: string;
  flight_name: string | null;
  flight_number: string | null;
  is_airport_pickup: boolean | null;
  payment_id: string | null;
  payment_method: string | null;
  payment_status: string;
  duration: number | null;
  flight_track: boolean | null;
  meet_greet: boolean | null;
  child_seat: string | null;
  infant_seat: string | null;
  booster_seat: string | null;
  extras_description: string | null;
  extras_total: string | null;
  created_at: Date;
  updated_at: Date;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        const result: ApiResponse<OrderDetail> = await response.json();

        if (result.success && result.data) {
          setOrder(result.data);
        } else {
          toast.error(result.error || "Failed to load order");
          router.push("/admin/orders");
        }
      } catch (error) {
        console.error("Order detail error:", error);
        toast.error("An error occurred while loading order");
        router.push("/admin/orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order ID: {order.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{order.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{order.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{order.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{order.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Car</p>
              <p className="font-medium">{order.car}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">€{order.price}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <span
                className={`px-2 py-1 rounded-full text-xs inline-block ${
                  order.payment_status === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.payment_status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.payment_status}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Pickup Location</p>
              <p className="font-medium">{order.pickup_location}</p>
            </div>
            {order.dropoff_location && (
              <div>
                <p className="text-sm text-muted-foreground">Dropoff Location</p>
                <p className="font-medium">{order.dropoff_location}</p>
              </div>
            )}
            {order.distance && (
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="font-medium">{order.distance} km</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.pickup_date && (
              <div>
                <p className="text-sm text-muted-foreground">Pickup Date</p>
                <p className="font-medium">
                  {format(new Date(order.pickup_date), "MMM d, yyyy")}
                  {order.pickup_time && ` at ${order.pickup_time}`}
                </p>
              </div>
            )}
            {order.return_date && (
              <div>
                <p className="text-sm text-muted-foreground">Return Date</p>
                <p className="font-medium">
                  {format(new Date(order.return_date), "MMM d, yyyy")}
                  {order.return_time && ` at ${order.return_time}`}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Passengers</p>
              <p className="font-medium">
                {order.passengers} adults, {order.kids} kids, {order.bags} bags
              </p>
            </div>
            {order.duration && (
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{order.duration} hours</p>
              </div>
            )}
          </CardContent>
        </Card>

        {order.flight_number && (
          <Card>
            <CardHeader>
              <CardTitle>Flight Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.flight_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Flight Name</p>
                  <p className="font-medium">{order.flight_name}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Flight Number</p>
                <p className="font-medium">{order.flight_number}</p>
              </div>
              {order.is_airport_pickup && (
                <div>
                  <p className="text-sm text-muted-foreground">Airport Pickup</p>
                  <p className="font-medium">Yes</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">
                {format(new Date(order.created_at), "MMM d, yyyy HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {format(new Date(order.updated_at), "MMM d, yyyy HH:mm")}
              </p>
            </div>
            {order.payment_method && (
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{order.payment_method}</p>
              </div>
            )}
            {order.payment_id && (
              <div>
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <p className="font-medium font-mono text-xs">{order.payment_id}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

