"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fraunces, Work_Sans } from "next/font/google";
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

const IN_PROGRESS_STATUSES: OrderStatus[] = ["CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"];
const COMPLETED_STATUSES: OrderStatus[] = ["DELIVERED", "REJECTED", "CANCELLED"];

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

// Simple client-side approximation for "today" — no dedicated analytics
// endpoint exists, so this reads createdAt on whatever orders/provider
// already returned rather than querying anything new.
function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function timeAgo(dateStr: string): string {
  const minutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ago`;
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

function StatTile({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-4">
      <p className="text-xs text-[#2B2013]/50 mb-1">{label}</p>
      <p className={`${fraunces.className} text-2xl font-semibold`} style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function OrderCard({
  order,
  variant,
  nextAction,
  isMutating,
  isErrored,
  errorMessage,
  onAdvance,
  onReject,
}: {
  order: Order;
  variant: "attention" | "progress" | "completed";
  nextAction: { label: string; next: OrderStatus } | null;
  isMutating: boolean;
  isErrored: boolean;
  errorMessage?: string;
  onAdvance: () => void;
  onReject: () => void;
}) {
  const accentColor =
    variant === "attention" ? "#D89B2C" : variant === "progress" ? "#55713C" : "#2B2013";

  return (
    <div
      className="row-enter rounded-2xl bg-white/70 backdrop-blur-sm p-4 border-l-4"
      style={{ borderLeftColor: accentColor, borderTop: "1px solid rgba(43,32,19,0.08)", borderRight: "1px solid rgba(43,32,19,0.08)", borderBottom: "1px solid rgba(43,32,19,0.08)" }}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {variant === "attention" && (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="attn-ping absolute inline-flex h-full w-full rounded-full bg-[#D89B2C] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D89B2C]" />
              </span>
            )}
            <p className="font-semibold truncate">#{order.id.slice(-10)}</p>
            <span className="text-xs text-[#2B2013]/45">{timeAgo(order.createdAt)}</span>
          </div>
          <p className="text-sm text-[#2B2013]/55">Customer: {order.userId.slice(-8)}</p>
        </div>

        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium text-white shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <ul className="mt-3 text-sm text-[#2B2013]/70 space-y-0.5">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.itemName} × {item.quantity} — ₹{item.subtotal}
          </li>
        ))}
      </ul>

      <p className="mt-2 text-sm text-[#2B2013]/55">Delivery: {order.deliveryAddress}</p>
      <p className={`${fraunces.className} mt-1 font-semibold`}>Total: ₹{order.totalAmount}</p>

      {isErrored && (
        <p className="text-red-600 text-sm mt-2">{errorMessage || "Update failed"}</p>
      )}

      {(nextAction || order.status === "PENDING") && (
        <div className="flex gap-2 mt-3">
          {nextAction && (
            <button
              onClick={onAdvance}
              disabled={isMutating}
              className="btn-3d btn-3d-dark bg-[#2B2013] text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform disabled:cursor-not-allowed"
            >
              {isMutating ? "Updating..." : nextAction.label}
            </button>
          )}

          {order.status === "PENDING" && (
            <button
              onClick={onReject}
              disabled={isMutating}
              className="text-sm font-medium px-4 py-1.5 rounded-full text-[#B23A2E] border border-[#B23A2E]/25 hover:bg-[#B23A2E]/5 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProviderDashboard() {
  const queryClient = useQueryClient();
  const [showCompleted, setShowCompleted] = useState(false);

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
  const statusMutation = useMutation<Order, Error, { orderId: string; status: OrderStatus }>({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      // Tell TanStack Query the provider orders list is now out of date —
      // it will automatically refetch, so the UI updates without a manual reload.
      queryClient.invalidateQueries({ queryKey: ["orders", "provider"] });
    },
  });

  const needsAttention = (orders ?? [])
    .filter((o) => o.status === "PENDING")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const inProgress = (orders ?? [])
    .filter((o) => IN_PROGRESS_STATUSES.includes(o.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const completed = (orders ?? [])
    .filter((o) => COMPLETED_STATUSES.includes(o.status))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const todayOrders = (orders ?? []).filter((o) => isToday(o.createdAt));
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "REJECTED" && o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const renderCard = (order: Order, variant: "attention" | "progress" | "completed") => {
    const isMutating =
      statusMutation.isPending && statusMutation.variables?.orderId === order.id;
    const isErrored =
      statusMutation.isError && statusMutation.variables?.orderId === order.id;

    return (
      <OrderCard
        key={order.id}
        order={order}
        variant={variant}
        nextAction={getNextAction(order.status)}
        isMutating={isMutating}
        isErrored={isErrored}
        errorMessage={
          isErrored && statusMutation.error instanceof Error
            ? statusMutation.error.message
            : undefined
        }
        onAdvance={() => {
          const next = getNextAction(order.status);
          if (next) statusMutation.mutate({ orderId: order.id, status: next.next });
        }}
        onReject={() => statusMutation.mutate({ orderId: order.id, status: "REJECTED" })}
      />
    );
  };

  return (
    <div className={`${workSans.className} max-w-4xl mx-auto px-6 py-8`}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .row-enter { animation: rowEnter 0.4s ease-out both; }
          .attn-ping { animation: attnPing 1.6s cubic-bezier(0, 0, 0.2, 1) infinite; }
          .skeleton-pulse { animation: skeletonPulse 1.4s ease-in-out infinite; }
        }

        @keyframes rowEnter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes attnPing {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }

        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .btn-3d { position: relative; transform: translateY(0); }
        .btn-3d:active { transform: translateY(2px); }
        .btn-3d-dark { box-shadow: 0 3px 0 #17110b; }
        .btn-3d-dark:active { box-shadow: 0 1px 0 #17110b; }
        .btn-3d-dark:disabled { box-shadow: 0 3px 0 #17110b; transform: translateY(0); opacity: 0.6; }
      `}</style>

      <h1 className={`${fraunces.className} text-3xl font-semibold mb-6`}>Incoming Orders</h1>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatTile label="Needs attention" value={String(needsAttention.length)} accent="#D89B2C" />
        <StatTile label="In progress" value={String(inProgress.length)} accent="#55713C" />
        <StatTile label="Orders today" value={String(todayOrders.length)} accent="#2B2013" />
        <StatTile label="Revenue today" value={`₹${todayRevenue}`} accent="#B23A2E" />
      </div>

      {isError && (
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : "Failed to load orders"}
        </p>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-pulse rounded-2xl border border-[#2B2013]/10 bg-white/60 p-4 h-[140px]"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      )}

      {!isLoading && orders && orders.length === 0 && (
        <p className="text-[#2B2013]/55">No orders yet.</p>
      )}

      {!isLoading && needsAttention.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#D89B2C] mb-3 uppercase tracking-wide">
            Needs your attention ({needsAttention.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {needsAttention.map((o) => renderCard(o, "attention"))}
          </div>
        </div>
      )}

      {!isLoading && inProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#55713C] mb-3 uppercase tracking-wide">
            In progress ({inProgress.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {inProgress.map((o) => renderCard(o, "progress"))}
          </div>
        </div>
      )}

      {!isLoading && completed.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-[#2B2013]/50 uppercase tracking-wide mb-3"
          >
            Completed ({completed.length})
            <span
              className="transition-transform"
              style={{ transform: showCompleted ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▾
            </span>
          </button>

          {showCompleted && (
            <div className="space-y-3">
              {completed.map((o) => renderCard(o, "completed"))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}