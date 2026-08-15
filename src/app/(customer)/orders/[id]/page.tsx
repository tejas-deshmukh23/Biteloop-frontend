"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Script from "next/script";
import type { ApiResponse } from "@/lib/types/auth";
import type { Order } from "@/lib/types/order";
import type { InitiatePaymentResponse } from "@/lib/types/payment";

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
    return <div className="p-6 text-gray-500">Loading order...</div>;
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <div className="p-6 text-red-600">
        {orderQuery.error instanceof Error
          ? orderQuery.error.message
          : "Order not found"}
      </div>
    );
  }

  const order = orderQuery.data;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-1">Order Confirmation</h1>
        <p className="text-sm text-gray-500 mb-6">Order #{order.id}</p>

        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Status</span>
            <span
              className={`text-sm px-2 py-1 rounded font-medium ${
                order.status === "PENDING"
                  ? "bg-amber-100 text-amber-700"
                  : order.status === "REJECTED" || order.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.itemName} × {item.quantity}
                </span>
                <span>₹{item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold border-t pt-3">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Delivering to: {order.deliveryAddress}
          </p>
        </div>

        {order.status === "PENDING" && (
          <>
            <button
              onClick={() => paymentMutation.mutate()}
              disabled={paymentMutation.isPending}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
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
          </>
        )}
      </div>
    </>
  );
}