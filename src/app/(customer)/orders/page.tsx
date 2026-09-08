"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Fraunces, Work_Sans } from "next/font/google";
import type { ApiResponse } from "@/lib/types/auth";
import type { Order, OrderStatus } from "@/lib/types/order";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
});

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
  if (status === "PENDING") return "bg-[#D89B2C]/15 text-[#a67722]";
  if (status === "REJECTED" || status === "CANCELLED") return "bg-[#B23A2E]/10 text-[#B23A2E]";
  return "bg-[#55713C]/12 text-[#3f5a2c]";
}

function statusDotClasses(status: OrderStatus): string {
  if (status === "PENDING") return "bg-[#D89B2C]";
  if (status === "REJECTED" || status === "CANCELLED") return "bg-[#B23A2E]";
  return "bg-[#55713C]";
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

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="skeleton-pulse rounded-2xl border border-[#2B2013]/10 bg-white/60 p-4 h-[104px]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between mb-3">
        <div className="h-3 bg-[#2B2013]/10 rounded w-20" />
        <div className="h-5 bg-[#2B2013]/10 rounded-full w-16" />
      </div>
      <div className="h-3 bg-[#2B2013]/10 rounded w-24 mb-3" />
      <div className="flex justify-between">
        <div className="h-3 bg-[#2B2013]/10 rounded w-28" />
        <div className="h-4 bg-[#2B2013]/10 rounded w-12" />
      </div>
    </div>
  );
}

function EmptyOrdersIllustration() {
  return (
    <svg viewBox="0 0 160 140" className="w-28 h-auto mx-auto mb-4" aria-hidden="true">
      <rect x="35" y="40" width="90" height="70" rx="10" fill="none" stroke="#2B2013" strokeOpacity="0.18" strokeWidth="4" />
      <line x1="50" y1="60" x2="110" y2="60" stroke="#2B2013" strokeOpacity="0.15" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="75" x2="95" y2="75" stroke="#2B2013" strokeOpacity="0.15" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="90" x2="105" y2="90" stroke="#2B2013" strokeOpacity="0.15" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
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
    <div className={`${workSans.className} max-w-3xl mx-auto px-6 py-8`}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .row-enter {
            animation: rowEnter 0.45s ease-out both;
          }
          .skeleton-pulse {
            animation: skeletonPulse 1.4s ease-in-out infinite;
          }
        }

        @keyframes rowEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <h1 className={`${fraunces.className} text-3xl font-semibold mb-5`}>Your Orders</h1>

      {/* Pill filter row */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 scrollbar-none">
        {STATUS_OPTIONS.map((opt) => {
          const active = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`shrink-0 text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                active
                  ? "bg-[#B23A2E] text-white border-[#B23A2E] shadow-[0_6px_16px_-8px_rgba(178,58,46,0.5)]"
                  : "bg-white/70 text-[#2B2013]/65 border-[#2B2013]/10 hover:border-[#2B2013]/25"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {isError && (
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      )}

      {cancelError && <p className="text-red-600 mb-4">{cancelError}</p>}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      )}

      {!isLoading && !isError && sortedOrders.length === 0 && (
        <div className="text-center py-10">
          <EmptyOrdersIllustration />
          <p className="text-[#2B2013]/55">
            No orders found{statusFilter !== "ALL" ? ` with status "${STATUS_OPTIONS.find(o => o.value === statusFilter)?.label}"` : ""}.
          </p>
        </div>
      )}

      {!isLoading && !isError && sortedOrders.length > 0 && (
        <div className="space-y-3">
          {sortedOrders.map((order, index) => {
            const isCancellable = CANCELLABLE_STATUSES.includes(order.status);
            const isThisOrderCancelling = cancellingId === order.id;

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="row-enter block rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-4 hover:shadow-[0_12px_28px_-14px_rgba(43,32,19,0.3)] hover:-translate-y-0.5 transition-all"
                style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-[#2B2013]/45 font-mono">
                    #{order.id.slice(-10)}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusBadgeClasses(
                      order.status
                    )}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotClasses(order.status)}`} />
                    {order.status}
                  </span>
                </div>

                <p className="text-sm text-[#2B2013]/60 mb-1">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#2B2013]/45">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className={`${fraunces.className} font-semibold`}>
                    ₹{order.totalAmount}
                  </span>
                </div>

                {isCancellable && (
                  <button
                    onClick={(e) => handleCancel(e, order.id)}
                    disabled={isThisOrderCancelling}
                    className="mt-3 text-sm text-[#B23A2E] border border-[#B23A2E]/25 rounded-full px-3 py-1.5 hover:bg-[#B23A2E]/5 disabled:opacity-50 transition-colors"
                  >
                    {isThisOrderCancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}