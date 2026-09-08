"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Script from "next/script";
import { Fraunces, Work_Sans } from "next/font/google";
import type { ApiResponse } from "@/lib/types/auth";
import type { Order, OrderStatus } from "@/lib/types/order";
import type { InitiatePaymentResponse } from "@/lib/types/payment";

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

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Placed" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PREPARING", label: "Preparing" },
  { status: "READY", label: "Ready" },
  { status: "OUT_FOR_DELIVERY", label: "On the way" },
  { status: "DELIVERED", label: "Delivered" },
];

async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`);
  const payload: ApiResponse<Order> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to fetch order");
  }

  return payload.data;
}

async function initiatePayment(orderId: string): Promise<InitiatePaymentResponse> {
  const res = await fetch("/api/payments/initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });

  const payload: ApiResponse<InitiatePaymentResponse> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to initiate payment");
  }

  return payload.data;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function StatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.status === status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const reached = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step.status} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`relative w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-500 ${
                  reached ? "bg-[#B23A2E] text-white" : "bg-[#2B2013]/10 text-[#2B2013]/40"
                }`}
              >
                {isCurrent && (
                  <span className="step-ping absolute inline-flex h-full w-full rounded-full bg-[#B23A2E] opacity-60" />
                )}
                <span className="relative">{reached ? "✓" : i + 1}</span>
              </div>
              <span
                className={`text-[11px] mt-1.5 text-center leading-tight ${
                  reached ? "text-[#2B2013]/80 font-medium" : "text-[#2B2013]/35"
                }`}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 h-0.5 mx-1 -mt-4">
                <div
                  className={`h-full transition-all duration-500 ${
                    i < currentIndex ? "bg-[#B23A2E]" : "bg-[#2B2013]/10"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const orderQuery = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
    // Poll while PENDING — status flips via Kafka after the webhook fires,
    // not synchronously, so we need to keep checking rather than expect
    // an immediate response from anything the frontend calls directly.
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING" ? 3000 : false,
  });

  const paymentMutation = useMutation({
    mutationFn: () => initiatePayment(id),
    onSuccess: (payment) => {
      const razorpay = new window.Razorpay({
        key: payment.razorpayKeyId,
        amount: Math.round(payment.amount * 100), // rupees → paise for display
        currency: payment.currency,
        order_id: payment.razorpayOrderId,
        name: "Biteloop",
        description: `Order #${payment.orderId}`,
        handler: () => {
          // Payment succeeded at Razorpay's end — but our order status
          // only updates once the webhook → Kafka → order-service chain
          // completes. The polling refetchInterval above will pick up
          // the CONFIRMED status once that finishes; nothing to do here
          // except let the existing query keep polling.
          orderQuery.refetch();
        },
        modal: {
          ondismiss: () => {
            // User closed the Razorpay modal without paying —
            // order stays PENDING, they can retry via the button again.
          },
        },
      });
      razorpay.open();
    },
  });

  if (orderQuery.isLoading) {
    return (
      <div className={`${workSans.className} max-w-2xl mx-auto px-6 py-8`}>
        <div className="skeleton-pulse">
          <div className="h-8 bg-[#2B2013]/10 rounded w-1/2 mb-2" />
          <div className="h-4 bg-[#2B2013]/10 rounded w-1/3 mb-8" />
          <div className="h-24 bg-[#2B2013]/10 rounded-2xl mb-6" />
          <div className="h-40 bg-[#2B2013]/10 rounded-2xl" />
        </div>
        <style jsx global>{`
          @media (prefers-reduced-motion: no-preference) {
            .skeleton-pulse { animation: skeletonPulse 1.4s ease-in-out infinite; }
          }
          @keyframes skeletonPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        `}</style>
      </div>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <div className={`${workSans.className} max-w-2xl mx-auto px-6 py-8 text-red-600`}>
        {orderQuery.error instanceof Error ? orderQuery.error.message : "Order not found"}
      </div>
    );
  }

  const order = orderQuery.data;
  const isTerminalNegative = order.status === "REJECTED" || order.status === "CANCELLED";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className={`${workSans.className} max-w-2xl mx-auto px-6 py-8`}>
        <style jsx global>{`
          @media (prefers-reduced-motion: no-preference) {
            .fade-enter { animation: fadeEnter 0.5s ease-out both; }
            .step-ping { animation: stepPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; }
            .live-ping { animation: livePing 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
          }

          @keyframes fadeEnter {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes stepPing {
            75%, 100% { transform: scale(1.7); opacity: 0; }
          }

          @keyframes livePing {
            75%, 100% { transform: scale(1.8); opacity: 0; }
          }

          .btn-3d { position: relative; transform: translateY(0); }
          .btn-3d:active { transform: translateY(2px); }
          .btn-3d-primary { box-shadow: 0 4px 0 #8f2a20; }
          .btn-3d-primary:active { box-shadow: 0 1px 0 #8f2a20; }
          .btn-3d-primary:disabled {
            box-shadow: 0 4px 0 #8f2a20;
            transform: translateY(0);
            opacity: 0.6;
          }
        `}</style>

        <div className="fade-enter mb-6">
          <h1 className={`${fraunces.className} text-3xl font-semibold mb-1`}>
            Order Confirmation
          </h1>
          <p className="text-[#2B2013]/50 text-sm">Order #{order.id}</p>
        </div>

        {/* Status */}
        <div
          className="fade-enter rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-5 mb-6"
          style={{ animationDelay: "80ms" }}
        >
          {isTerminalNegative ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B23A2E]" />
              <span className="font-semibold text-[#B23A2E]">
                {order.status === "REJECTED" ? "Order rejected" : "Order cancelled"}
              </span>
            </div>
          ) : (
            <>
              <StatusTracker status={order.status} />
              {order.status === "PENDING" && (
                <div className="flex items-center gap-1.5 justify-center mt-4 text-xs text-[#2B2013]/45">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-[#D89B2C] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D89B2C]" />
                  </span>
                  Checking for updates
                </div>
              )}
            </>
          )}
        </div>

        {/* Order items */}
        <div
          className="fade-enter rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-5 mb-6"
          style={{ animationDelay: "150ms" }}
        >
          <div className="space-y-2 mb-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-[#2B2013]/75">
                  {item.itemName} × {item.quantity}
                </span>
                <span className="font-medium">₹{item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold border-t border-[#2B2013]/10 pt-3">
            <span className={fraunces.className}>Total</span>
            <span className={fraunces.className}>₹{order.totalAmount}</span>
          </div>

          <p className="text-sm text-[#2B2013]/50 mt-3">
            Delivering to: {order.deliveryAddress}
          </p>
        </div>

        {order.status === "PENDING" && (
          <div className="fade-enter" style={{ animationDelay: "220ms" }}>
            <button
              onClick={() => paymentMutation.mutate()}
              disabled={paymentMutation.isPending}
              className="btn-3d btn-3d-primary w-full bg-[#B23A2E] text-white py-3.5 rounded-full font-medium transition-transform disabled:cursor-not-allowed"
            >
              {paymentMutation.isPending ? "Starting payment..." : `Pay Now — ₹${order.totalAmount}`}
            </button>

            {paymentMutation.isError && (
              <p className="text-red-600 text-sm mt-2">
                {paymentMutation.error instanceof Error
                  ? paymentMutation.error.message
                  : "Something went wrong"}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}