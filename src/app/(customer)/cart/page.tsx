"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Fraunces, Work_Sans } from "next/font/google";
import { useCartStore } from "@/lib/store/cartStore";
import type { ApiResponse } from "@/lib/types/auth";
import type { Order, PlaceOrderRequest } from "@/lib/types/order";

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

async function placeOrder(request: PlaceOrderRequest): Promise<Order> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const payload: ApiResponse<Order> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to place order");
  }

  return payload.data;
}

function EmptyCartIllustration() {
  return (
    <svg viewBox="0 0 160 140" className="w-32 h-auto mx-auto mb-5" aria-hidden="true">
      <rect x="30" y="55" width="100" height="42" rx="10" fill="none" stroke="#2B2013" strokeOpacity="0.2" strokeWidth="4" />
      <rect x="30" y="55" width="100" height="12" rx="6" fill="#2B2013" fillOpacity="0.1" />
      <path d="M55 55 Q80 30 105 55" fill="none" stroke="#2B2013" strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" />
      <circle cx="80" cy="76" r="8" fill="none" stroke="#D89B2C" strokeOpacity="0.4" strokeWidth="3" strokeDasharray="4 5" />
    </svg>
  );
}

export default function CartPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const providerId = useCartStore((state) => state.providerId);
  const providerName = useCartStore((state) => state.providerName);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalAmount = useCartStore((state) => state.totalAmount);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (order) => {
      clearCart();
      router.push(`/orders/${order.id}`);
    },
  });

  const handlePlaceOrder = () => {
    setFormError(null);

    if (!deliveryAddress.trim()) {
      setFormError("Delivery address is required");
      return;
    }

    if (!providerId || items.length === 0) {
      setFormError("Your cart is empty");
      return;
    }

    mutation.mutate({
      providerId,
      deliveryAddress: deliveryAddress.trim(),
      notes: notes.trim() || undefined,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        quantity: item.quantity,
      })),
    });
  };

  if (items.length === 0) {
    return (
      <div className={`${workSans.className} max-w-2xl mx-auto px-6 py-16 text-center`}>
        <EmptyCartIllustration />
        <h1 className={`${fraunces.className} text-2xl font-semibold mb-2`}>
          Your cart is empty
        </h1>
        <p className="text-[#2B2013]/60 mb-6">
          Browse local kitchens and add something delicious.
        </p>
        <Link
          href="/providers"
          className="inline-block bg-[#B23A2E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#963025] transition-colors"
        >
          Browse kitchens
        </Link>
      </div>
    );
  }

  return (
    <div className={`${workSans.className} max-w-2xl mx-auto px-6 py-8 pb-40`}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .row-enter {
            animation: rowEnter 0.45s ease-out both;
          }
          .checkout-bar-enter {
            animation: checkoutBarEnter 0.4s ease-out both;
          }
        }

        @keyframes rowEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes checkoutBarEnter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-3d {
          position: relative;
          transform: translateY(0);
        }
        .btn-3d:active {
          transform: translateY(2px);
        }
        .btn-3d-primary {
          box-shadow: 0 4px 0 #8f2a20;
        }
        .btn-3d-primary:active {
          box-shadow: 0 1px 0 #8f2a20;
        }
        .btn-3d-primary:disabled {
          box-shadow: 0 4px 0 #8f2a20;
          transform: translateY(0);
          opacity: 0.6;
        }
      `}</style>

      <h1 className={`${fraunces.className} text-3xl font-semibold mb-1`}>Your Cart</h1>
      {providerName && (
        <p className="text-[#2B2013]/55 mb-6">Ordering from {providerName}</p>
      )}

      <div className="space-y-3 mb-8">
        {items.map((item, index) => (
          <div
            key={item.menuItemId}
            className="row-enter flex items-center justify-between rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-4"
            style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
          >
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{item.itemName}</h3>
              <p className="text-sm text-[#2B2013]/50">₹{item.itemPrice} each</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 bg-[#2B2013]/5 rounded-full px-1 py-1">
                <button
                  onClick={() =>
                    updateQuantity(item.menuItemId, Math.max(1, item.quantity - 1))
                  }
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-medium hover:bg-[#2B2013]/5 transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-medium hover:bg-[#2B2013]/5 transition-colors"
                >
                  +
                </button>
              </div>

              <p className="w-16 text-right font-semibold">
                ₹{item.itemPrice * item.quantity}
              </p>

              <button
                onClick={() => removeItem(item.menuItemId)}
                className="text-[#B23A2E] text-sm font-medium hover:text-[#963025] transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-5 space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Address</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B23A2E]/40 focus:border-[#B23A2E] transition-shadow"
            rows={2}
            placeholder="Flat / building, street, area..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes <span className="text-[#2B2013]/40">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-[#2B2013]/15 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B23A2E]/40 focus:border-[#B23A2E] transition-shadow"
            rows={2}
            placeholder="Any special instructions..."
          />
        </div>
      </div>

      {(formError || mutation.isError) && (
        <p className="text-red-600 text-sm mb-4">
          {formError ||
            (mutation.error instanceof Error ? mutation.error.message : "Something went wrong")}
        </p>
      )}

      {/* Sticky checkout bar — total + action always reachable regardless of scroll */}
      <div className="fixed bottom-0 inset-x-0 z-20 checkout-bar-enter">
        <div className="max-w-2xl mx-auto px-6 pb-6 pt-4">
          <div className="bg-white/90 backdrop-blur-xl border border-[#2B2013]/10 rounded-2xl shadow-[0_-8px_30px_-8px_rgba(43,32,19,0.15)] p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#2B2013]/50">Total</p>
              <p className={`${fraunces.className} text-xl font-semibold`}>
                ₹{totalAmount()}
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={mutation.isPending}
              className="btn-3d btn-3d-primary bg-[#B23A2E] text-white font-medium px-6 py-3 rounded-full transition-transform disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}