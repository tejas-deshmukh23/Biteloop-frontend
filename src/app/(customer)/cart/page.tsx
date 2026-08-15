"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useCartStore } from "@/lib/store/cartStore";
import type { ApiResponse } from "@/lib/types/auth";
import type { Order, PlaceOrderRequest } from "@/lib/types/order";

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
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
        <p className="text-gray-500">
          Your cart is empty. Browse providers to add items.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-1">Your Cart</h1>
      {providerName && (
        <p className="text-sm text-gray-500 mb-6">Ordering from {providerName}</p>
      )}

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.menuItemId}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
          >
            <div>
              <h3 className="font-medium">{item.itemName}</h3>
              <p className="text-sm text-gray-500">₹{item.itemPrice} each</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.menuItemId, Math.max(1, item.quantity - 1))
                  }
                  className="w-7 h-7 border border-gray-300 rounded text-sm"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  className="w-7 h-7 border border-gray-300 rounded text-sm"
                >
                  +
                </button>
              </div>

              <p className="w-16 text-right font-medium">
                ₹{item.itemPrice * item.quantity}
              </p>

              <button
                onClick={() => removeItem(item.menuItemId)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-lg font-semibold mb-6 border-t pt-4">
        <span>Total</span>
        <span>₹{totalAmount()}</span>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Address</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            rows={2}
            placeholder="Flat / building, street, area..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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

      <button
        onClick={handlePlaceOrder}
        disabled={mutation.isPending}
        className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
      >
        {mutation.isPending ? "Placing order..." : `Place Order — ₹${totalAmount()}`}
      </button>
    </div>
  );
}