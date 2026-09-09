"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Fraunces, Work_Sans } from "next/font/google";
import { useAuthStore } from "@/lib/store/authStore";
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

// An order still needs attention/tracking until it reaches one of these
// terminal states — everything else counts as "active" for the dashboard.
const TERMINAL_STATUSES: OrderStatus[] = ["DELIVERED", "REJECTED", "CANCELLED"];

const TRACK_STEPS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

// Same pattern as the login/register onSubmit fetch calls:
// hit our own BFF route, parse the envelope, throw on failure.
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

function MiniTracker({ status }: { status: OrderStatus }) {
  const currentIndex = TRACK_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-1.5 mt-3">
      {TRACK_STEPS.map((step, i) => (
        <div
          key={step}
          className="h-1.5 flex-1 rounded-full transition-colors duration-500"
          style={{ backgroundColor: i <= currentIndex ? "#B23A2E" : "rgba(43,32,19,0.1)" }}
        />
      ))}
    </div>
  );
}

function BrowseIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 shrink-0" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="rgba(216,155,44,0.15)" />
      <ellipse cx="50" cy="55" rx="28" ry="16" fill="#D89B2C" />
      <ellipse cx="50" cy="51" rx="24" ry="12" fill="#E4AE49" />
      <path d="M30 40 Q50 20 70 40" stroke="#2B2013" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function CustomerDashboard() {
  const user = useAuthStore((state) => state.user);

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: fetchMyOrders,
  });

  // Most recent non-terminal order, if any — orders/my isn't guaranteed
  // to come back sorted, so sort defensively before picking one.
  const activeOrder = orders
    ? [...orders]
        .filter((o) => !TERMINAL_STATUSES.includes(o.status))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : undefined;

  return (
    <div className={`${workSans.className} max-w-3xl mx-auto px-6 py-8`}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .fade-enter { animation: fadeEnter 0.5s ease-out both; }
          .skeleton-pulse { animation: skeletonPulse 1.4s ease-in-out infinite; }
          .live-ping { animation: livePing 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        }

        @keyframes fadeEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes livePing {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }

        .btn-3d { position: relative; transform: translateY(0); }
        .btn-3d:active { transform: translateY(2px); }
        .btn-3d-primary { box-shadow: 0 4px 0 #8f2a20; }
        .btn-3d-primary:active { box-shadow: 0 1px 0 #8f2a20; }
      `}</style>

      <div className="fade-enter mb-6">
        <h1 className={`${fraunces.className} text-3xl font-semibold`}>
          {user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome back"}
        </h1>
        <p className="text-[#2B2013]/55 mt-1">Hungry? Let's find something good.</p>
      </div>

      {isError && (
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : "Failed to load dashboard"}
        </p>
      )}

      {isLoading && (
        <div className="space-y-4">
          <div className="skeleton-pulse rounded-2xl border border-[#2B2013]/10 bg-white/60 h-32" />
          <div className="skeleton-pulse rounded-2xl border border-[#2B2013]/10 bg-white/60 h-20" style={{ animationDelay: "100ms" }} />
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-4">
          {activeOrder ? (
            <Link
              href={`/orders/${activeOrder.id}`}
              className="fade-enter block rounded-2xl border border-[#D89B2C]/25 bg-white/80 backdrop-blur-sm p-5 hover:shadow-[0_16px_32px_-16px_rgba(216,155,44,0.4)] hover:-translate-y-0.5 transition-all"
              style={{ animationDelay: "80ms" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-[#D89B2C] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D89B2C]" />
                </span>
                <p className="text-sm text-[#D89B2C] font-semibold">Active order</p>
              </div>

              <div className="flex justify-between items-center">
                <p className={`${fraunces.className} font-semibold`}>
                  {activeOrder.items.length} item
                  {activeOrder.items.length !== 1 ? "s" : ""} · ₹{activeOrder.totalAmount}
                </p>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#2B2013]/5 text-[#2B2013]/70">
                  {STATUS_LABELS[activeOrder.status] ?? activeOrder.status}
                </span>
              </div>

              <MiniTracker status={activeOrder.status} />

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-[#2B2013]/45">
                  Placed {new Date(activeOrder.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <span className="text-sm text-[#B23A2E] font-semibold">Track order →</span>
              </div>
            </Link>
          ) : (
            <div className="fade-enter rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-5 flex items-center gap-4" style={{ animationDelay: "80ms" }}>
              <BrowseIllustration />
              <div>
                <p className={`${fraunces.className} font-semibold mb-0.5`}>No active orders</p>
                <p className="text-sm text-[#2B2013]/55">
                  Nothing on the way right now — hungry for something?
                </p>
              </div>
            </div>
          )}

          <Link
            href="/providers"
            className="btn-3d btn-3d-primary fade-enter block bg-[#B23A2E] text-white rounded-2xl p-5 text-center font-medium transition-transform"
            style={{ animationDelay: "160ms" }}
          >
            Browse kitchens near you
          </Link>

          <Link
            href="/orders"
            className="fade-enter block text-center text-sm text-[#2B2013]/55 hover:text-[#B23A2E] transition-colors pt-1"
            style={{ animationDelay: "220ms" }}
          >
            View all your orders
          </Link>
        </div>
      )}
    </div>
  );
}