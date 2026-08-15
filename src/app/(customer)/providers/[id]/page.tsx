"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { ApiResponse } from "@/lib/types/auth";
import type { Provider } from "@/lib/types/provider";
import type { MenuItem } from "@/lib/types/menu";
import { useCartStore } from "@/lib/store/cartStore";

async function fetchProvider(id: string): Promise<Provider> {
  const res = await fetch(`/api/providers/${id}`);
  const payload: ApiResponse<Provider> = await res.json();

  if (!res.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to fetch provider");
  }

  return payload.data;
}

async function fetchMenu(providerId: string): Promise<MenuItem[]> {
  const res = await fetch(`/api/menu/provider/${providerId}`);
  const payload: ApiResponse<MenuItem[]> = await res.json();

  if (!res.ok || !payload.success) {
    throw new Error(payload.message || "Failed to fetch menu");
  }

  return payload.data ?? [];
}

export default function ProviderMenuPage() {
  const { id } = useParams<{ id: string }>();

  const providerQuery = useQuery({
    queryKey: ["provider", id],
    queryFn: () => fetchProvider(id),
  });

  const menuQuery = useQuery({
    queryKey: ["menu", "provider", id],
    queryFn: () => fetchMenu(id),
  });

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const cartProviderId = useCartStore((state) => state.providerId);

  // Tracks quantity selector per item before "Add" is clicked
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQuantity = (itemId: string) => quantities[itemId] ?? 1;

  const setQuantity = (itemId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: Math.max(1, qty) }));
  };

  const handleAddToCart = (item: MenuItem, provider: Provider) => {
    addItem(provider.id, provider.businessName, {
      menuItemId: item.id,
      itemName: item.name,
      itemPrice: item.price,
      quantity: getQuantity(item.id),
    });
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  if (providerQuery.isLoading || menuQuery.isLoading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (providerQuery.isError) {
    return (
      <div className="p-6 text-red-600">
        {providerQuery.error instanceof Error
          ? providerQuery.error.message
          : "Provider not found"}
      </div>
    );
  }

  const provider = providerQuery.data!;
  const items = menuQuery.data ?? [];
  const availableItems = items.filter((item) => item.available);

  const cartItemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{provider.businessName}</h1>
        {provider.description && (
          <p className="text-gray-600 mt-1">{provider.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">{provider.address}</p>
      </div>

      {menuQuery.isError && (
        <p className="text-red-600 mb-4">
          {menuQuery.error instanceof Error
            ? menuQuery.error.message
            : "Failed to load menu"}
        </p>
      )}

      {availableItems.length === 0 ? (
        <p className="text-gray-500">No items available right now.</p>
      ) : (
        <div className="space-y-3">
          {availableItems.map((item) => {
            const inOtherCart =
              cartProviderId !== null && cartProviderId !== provider.id;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-3 h-3 rounded-sm border ${
                        item.veg
                          ? "border-green-600 bg-green-600"
                          : "border-red-600 bg-red-600"
                      }`}
                    />
                    <h3 className="font-medium">{item.name}</h3>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  )}
                  <p className="text-sm font-medium mt-1">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={getQuantity(item.id)}
                    onChange={(e) => setQuantity(item.id, Number(e.target.value))}
                    className="w-14 border border-gray-300 rounded px-2 py-1 text-center"
                  />
                  <button
                    onClick={() => handleAddToCart(item, provider)}
                    className="bg-orange-600 text-white px-3 py-1.5 rounded hover:bg-orange-700 text-sm"
                  >
                    Add
                  </button>
                </div>

                {inOtherCart && (
                  <p className="text-xs text-amber-600 mt-1">
                    Adding will clear your current cart from another provider.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {cartItemCount > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg font-medium"
        >
          View Cart ({cartItemCount})
        </Link>
      )}
    </div>
  );
}