"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderStatus } from "@/lib/types/order";

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

// Given the CURRENT status, what's the one logical next step a provider
// can take? Mirrors the documented state machine in OrderStatus.java.
// This is a UX guide only — the backend is the real source of truth
// on whether a transition is actually allowed.
function getNextAction(status: OrderStatus): { label: string; next: OrderStatus } | null {
  switch (status) {
    case "PENDING":
      return { label: "Accept order", next: "CONFIRMED" };
    case "CONFIRMED":
      return { label: "Start preparing", next: "PREPARING" };
    case "PREPARING":
      return { label: "Mark ready", next: "READY" };
    case "READY":
      return { label: "Out for delivery", next: "OUT_FOR_DELIVERY" };
    case "OUT_FOR_DELIVERY":
      return { label: "Mark delivered", next: "DELIVERED" };
    default:
      return null; // DELIVERED, REJECTED, CANCELLED — nothing further to do
  }
}

async function fetchProviderOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders/provider", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const payload = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to load orders");
  }

  return payload.data as Order[];
}

// Same raw-fetch style as the query functions — just a PUT this time.
async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const payload = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to update order");
  }

  return payload.data as Order;
}

export default function ProviderDashboard() {
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders", "provider"],
    queryFn: fetchProviderOrders,
  });

  // useMutation is for actions triggered by a user click, not run
  // automatically like useQuery. mutate() does nothing until called.
  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      // Tell TanStack Query the provider orders list is now out of date —
      // it will automatically refetch, so the UI updates without a manual reload.
      queryClient.invalidateQueries({ queryKey: ["orders", "provider"] });
    },
  });

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Incoming orders</h1>

      {isLoading && <p className="text-gray-500">Loading orders...</p>}

      {isError && (
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Failed to load orders"}
        </p>
      )}

      {orders && orders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      {orders && orders.length > 0 && (
        <ul className="space-y-4">
          {orders.map((order) => {
            const nextAction = getNextAction(order.status);
            const isThisOrderMutating =
              statusMutation.isPending &&
              statusMutation.variables?.orderId === order.id;

            return (
              <li key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Order {order.id}</p>
                    <p className="text-sm text-gray-500">
                      Customer: {order.userId}
                    </p>
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

                <p className="mt-2 text-sm text-gray-600">
                  Delivery: {order.deliveryAddress}
                </p>

                <p className="mt-1 font-medium">Total: ₹{order.totalAmount}</p>

                {statusMutation.isError && isThisOrderMutating && (
                  <p className="text-red-600 text-sm mt-2">
                    {statusMutation.error instanceof Error
                      ? statusMutation.error.message
                      : "Update failed"}
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  {nextAction && (
                    <button
                      onClick={() =>
                        statusMutation.mutate({ orderId: order.id, status: nextAction.next })
                      }
                      disabled={isThisOrderMutating}
                      className="bg-black text-white text-sm px-3 py-1.5 rounded disabled:opacity-50"
                    >
                      {isThisOrderMutating ? "Updating..." : nextAction.label}
                    </button>
                  )}

                  {order.status === "PENDING" && (
                    <button
                      onClick={() =>
                        statusMutation.mutate({ orderId: order.id, status: "REJECTED" })
                      }
                      disabled={isThisOrderMutating}
                      className="border text-sm px-3 py-1.5 rounded disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}