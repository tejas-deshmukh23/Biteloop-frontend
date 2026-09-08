"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Fraunces, Work_Sans } from "next/font/google";
import type { ApiResponse } from "@/lib/types/auth";
import type { Provider } from "@/lib/types/provider";
import type { MenuItem, MenuCategory } from "@/lib/types/menu";
import { useCartStore } from "@/lib/store/cartStore";

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

const CATEGORY_ORDER: MenuCategory[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACKS", "OTHER"];
const CATEGORY_LABELS: Record<MenuCategory, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACKS: "Snacks",
  OTHER: "More",
};

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

function SkeletonRow({ index }: { index: number }) {
  return (
    <div
      className="skeleton-pulse flex items-center justify-between rounded-2xl border border-[#2B2013]/10 bg-white/60 p-4 h-[92px]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex-1">
        <div className="h-4 bg-[#2B2013]/10 rounded w-1/3 mb-2" />
        <div className="h-3 bg-[#2B2013]/10 rounded w-1/2" />
      </div>
      <div className="w-24 h-9 bg-[#2B2013]/10 rounded-full" />
    </div>
  );
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
  // Brief "Added!" confirmation state per item, purely presentational
  const [justAdded, setJustAdded] = useState<Record<string, boolean>>({});

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

    setJustAdded((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setJustAdded((prev) => ({ ...prev, [item.id]: false }));
    }, 1100);
  };

  if (providerQuery.isError) {
    return (
      <div className={`${workSans.className} max-w-3xl mx-auto px-6 py-10 text-red-600`}>
        {providerQuery.error instanceof Error
          ? providerQuery.error.message
          : "Provider not found"}
      </div>
    );
  }

  const provider = providerQuery.data;
  const items = menuQuery.data ?? [];
  const availableItems = items.filter((item) => item.available);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: availableItems.filter((item) => item.category === cat),
  })).filter((group) => group.items.length > 0);

  const cartItemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className={`${workSans.className} max-w-3xl mx-auto px-6 py-8 pb-28`}>
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .row-enter {
            animation: rowEnter 0.5s ease-out both;
          }
          .skeleton-pulse {
            animation: skeletonPulse 1.4s ease-in-out infinite;
          }
          .cart-bar-enter {
            animation: cartBarEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
          .added-pop {
            animation: addedPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          }
          .live-ping {
            animation: livePing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
        }

        @keyframes rowEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes cartBarEnter {
          from { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }

        @keyframes addedPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        @keyframes livePing {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }

        .btn-3d {
          position: relative;
          transform: translateY(0);
        }
        .btn-3d:active {
          transform: translateY(2px);
        }
        .btn-3d-primary {
          box-shadow: 0 3px 0 #8f2a20;
        }
        .btn-3d-primary:active {
          box-shadow: 0 1px 0 #8f2a20;
        }
      `}</style>

      {/* Provider header */}
      {providerQuery.isLoading ? (
        <div className="skeleton-pulse mb-8">
          <div className="h-8 bg-[#2B2013]/10 rounded w-1/2 mb-3" />
          <div className="h-4 bg-[#2B2013]/10 rounded w-2/3" />
        </div>
      ) : (
        provider && (
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className={`${fraunces.className} text-3xl font-semibold mb-1`}>
                  {provider.businessName}
                </h1>
                {provider.description && (
                  <p className="text-[#2B2013]/65 leading-relaxed max-w-md">
                    {provider.description}
                  </p>
                )}
                <p className="text-sm text-[#2B2013]/50 mt-1">{provider.address}</p>
              </div>

              {provider.deliveryAvailable ? (
                <span className="flex items-center gap-1.5 text-xs text-[#55713C] font-medium bg-[#55713C]/10 px-3 py-1.5 rounded-full shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-[#55713C] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#55713C]" />
                  </span>
                  Delivers to you
                </span>
              ) : (
                <span className="text-xs bg-[#2B2013]/5 text-[#2B2013]/60 px-3 py-1.5 rounded-full shrink-0">
                  Pickup only
                </span>
              )}
            </div>
          </div>
        )
      )}

      {menuQuery.isError && (
        <p className="text-red-600 mb-4">
          {menuQuery.error instanceof Error
            ? menuQuery.error.message
            : "Failed to load menu"}
        </p>
      )}

      {/* Menu */}
      {menuQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} index={i} />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <p className="text-[#2B2013]/60">No items available right now.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.category}>
              <h2 className={`${fraunces.className} text-lg font-semibold mb-3 text-[#2B2013]/80`}>
                {CATEGORY_LABELS[group.category]}
              </h2>

              <div className="space-y-3">
                {group.items.map((item, index) => {
                  const inOtherCart =
                    cartProviderId !== null && provider && cartProviderId !== provider.id;
                  const added = justAdded[item.id];

                  return (
                    <div
                      key={item.id}
                      className="row-enter rounded-2xl border border-[#2B2013]/10 bg-white/70 backdrop-blur-sm p-4"
                      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block w-3 h-3 rounded-sm border shrink-0 ${
                                item.veg
                                  ? "border-[#55713C] bg-[#55713C]"
                                  : "border-[#B23A2E] bg-[#B23A2E]"
                              }`}
                            />
                            <h3 className="font-semibold truncate">{item.name}</h3>
                          </div>
                          {item.description && (
                            <p className="text-sm text-[#2B2013]/55 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-[#2B2013]/85 mt-1.5">
                            ₹{item.price}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-[#2B2013]/5 rounded-full px-1 py-1">
                            <button
                              onClick={() => setQuantity(item.id, getQuantity(item.id) - 1)}
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-medium hover:bg-[#2B2013]/5 transition-colors"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {getQuantity(item.id)}
                            </span>
                            <button
                              onClick={() => setQuantity(item.id, getQuantity(item.id) + 1)}
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-medium hover:bg-[#2B2013]/5 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleAddToCart(item, provider!)}
                            className={`btn-3d btn-3d-primary text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                              added ? "added-pop bg-[#55713C]" : "bg-[#B23A2E] hover:bg-[#963025]"
                            }`}
                          >
                            {added ? "Added ✓" : "Add"}
                          </button>
                        </div>
                      </div>

                      {inOtherCart && (
                        <p className="text-xs text-[#D89B2C] font-medium mt-2">
                          Adding will clear your current cart from another provider.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItemCount > 0 && (
        <Link
          href="/cart"
          className="cart-bar-enter fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#B23A2E] text-white px-6 py-3 rounded-full shadow-[0_12px_28px_-8px_rgba(178,58,46,0.5)] font-medium z-20"
        >
          View Cart ({cartItemCount})
        </Link>
      )}
    </div>
  );
}