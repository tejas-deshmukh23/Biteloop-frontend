import { create } from "zustand";

export interface CartItem {
  menuItemId: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
}

interface CartState {
  providerId: string | null;
  providerName: string | null;
  items: CartItem[];
  addItem: (providerId: string, providerName: string, item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  providerId: null,
  providerName: null,
  items: [],

  addItem: (providerId, providerName, item) => {
    const state = get();

    // Cart is scoped to one provider — switching providers clears it
    if (state.providerId && state.providerId !== providerId) {
      const confirmed = window.confirm(
        `Your cart has items from ${state.providerName}. Adding from ${providerName} will clear it. Continue?`
      );
      if (!confirmed) return;
      set({ providerId, providerName, items: [item] });
      return;
    }

    const existing = state.items.find((i) => i.menuItemId === item.menuItemId);
    if (existing) {
      set({
        providerId,
        providerName,
        items: state.items.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ providerId, providerName, items: [...state.items, item] });
    }
  },

  removeItem: (menuItemId) =>
    set((state) => {
      const items = state.items.filter((i) => i.menuItemId !== menuItemId);
      return {
        items,
        providerId: items.length ? state.providerId : null,
        providerName: items.length ? state.providerName : null,
      };
    }),

  updateQuantity: (menuItemId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity } : i
      ),
    })),

  clearCart: () => set({ providerId: null, providerName: null, items: [] }),

  totalAmount: () => get().items.reduce((sum, i) => sum + i.itemPrice * i.quantity, 0),
}));