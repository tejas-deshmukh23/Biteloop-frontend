// Mirrors com.tiffin.common.enums.OrderStatus
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "REJECTED"
  | "CANCELLED";

// Mirrors com.tiffin.dto.OrderItemResponse
export interface OrderItem {
  id: string;
  menuItemId: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  subtotal: number;
}

// Mirrors com.tiffin.dto.OrderResponse
export interface Order {
  id: string;
  userId: string;
  providerId: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  notes: string | null;
  items: OrderItem[];
  createdAt: string; // ISO-8601 string
  updatedAt: string; // ISO-8601 string
}

export interface OrderItemRequest {
  menuItemId: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
}

export interface PlaceOrderRequest {
  providerId: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItemRequest[];
}