"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/types/auth";
import type { Order, OrderStatus } from "@/lib/types/order";

const STATUS_OPTIONS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

// Cancel only makes sense before the provider has started preparing —
// matches the backend's own state machine comment (PENDING -> CONFIRMED
// -> PREPARING...). Once PREPARING or later, cancelling mid-cook makes
// no operational sense, so the button simply isn't shown.
const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING"];

function statusBadgeClasses(status: OrderStatus): string {
  if (status === "PENDING") return "bg-amber-100 text-amber-700";
  if (status === "REJECTED" || status === "CANCELLED") return "bg-red-100 text-red-700";
  return "bg-green-100 text-green-700";
}

async function fetchMyOrders(status: OrderStatus | "ALL"): Promise<Order[]> {
  const search = status === "ALL" ? "" : `?status=${status}`;
  const res = await fetch(`/api/orders/my${search}`);
  const payload: ApiResponse<Order[]> = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch orders");
  }

  return payload.data ?? [];
}

async function cancelOrder(orderId: string): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "DELETE" });
  const payload: ApiResponse<Order> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to cancel order");
  }

  return payload.data;
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ["orders", "my", statusFilter],
    queryFn: () => fetchMyOrders(statusFilter),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onMutate: (orderId) => {
      setCancellingId(orderId);
      setCancelError(null);
    },
    onSuccess: () => {
      // Refetch every "orders" query regardless of which status filter
      // is currently applied, since a cancelled order needs to disappear
      // from "Pending"/"Confirmed" views and appear under "Cancelled".
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
    },
    onError: (err) => {
      setCancelError(err instanceof Error ? err.message : "Failed to cancel order");
    },
    onSettled: () => {
      setCancellingId(null);
    },
  });

  const handleCancel = (e: React.MouseEvent, orderId: string) => {
    e.preventDefault(); // don't navigate via the parent Link
    e.stopPropagation();

    const confirmed = window.confirm("Cancel this order? This can't be undone.");
    if (!confirmed) return;

    cancelMutation.mutate(orderId);
  };

  const sortedOrders = orders
    ? [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>

      <div className="mb-6">
        <label htmlFor="status-filter" className="block text-sm font-medium mb-1">
          Filter by status
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "ALL")}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-gray-500">Loading orders...</p>}

      {isError && (
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {cancelError && <p className="text-red-600 mb-4">{cancelError}</p>}

      {!isLoading && !isError && sortedOrders.length === 0 && (
        <p className="text-gray-500">
          No orders found{statusFilter !== "ALL" ? ` with status "${statusFilter}"` : ""}.
        </p>
      )}

      <div className="space-y-3">
        {sortedOrders.map((order) => {
          const isCancellable = CANCELLABLE_STATUSES.includes(order.status);
          const isThisOrderCancelling = cancellingId === order.id;

          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500 font-mono">
                  #{order.id.slice(-10)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${statusBadgeClasses(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <span className="font-semibold">₹{order.totalAmount}</span>
              </div>

              {isCancellable && (
                <button
                  onClick={(e) => handleCancel(e, order.id)}
                  disabled={isThisOrderCancelling}
                  className="mt-3 text-sm text-red-600 border border-red-200 rounded px-3 py-1.5 hover:bg-red-50 disabled:opacity-50"
                >
                  {isThisOrderCancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}