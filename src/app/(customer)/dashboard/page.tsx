"use client";

import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/lib/types/order";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

// Same pattern as the login/register onSubmit fetch calls:
// hit our own BFF route, parse the envelope, throw on failure.
// TanStack Query's queryFn just needs to return the data or throw.
async function fetchMyOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders/my", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const payload = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to load orders");
  }

  return payload.data as Order[];
}

export default function CustomerDashboard() {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: fetchMyOrders,
  });

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your orders</h1>

      {isLoading && <p className="text-gray-500">Loading orders...</p>}

      {isError && (
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Failed to load orders"}
        </p>
      )}

      {orders && orders.length === 0 && (
        <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
      )}

      {orders && orders.length > 0 && (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Order {order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>

              <ul className="mt-3 text-sm text-gray-700 space-y-1">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.itemName} × {item.quantity} — ₹{item.subtotal}
                  </li>
                ))}
              </ul>

              <p className="mt-3 font-medium">Total: ₹{order.totalAmount}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}