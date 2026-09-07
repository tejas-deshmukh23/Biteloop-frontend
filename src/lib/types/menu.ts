export type MenuCategory = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS" | "OTHER";

// Mirrors com.tiffin.dto.MenuItemResponse
export interface MenuItem {
  id: string;
  providerId: string;
  name: string;
  description: string | null;
  price: number;
  category: MenuCategory;
  veg: boolean;       // isVeg() getter -> Jackson strips "is" -> "veg"
  available: boolean; // isAvailable() getter -> Jackson strips "is" -> "available"
  createdAt: string;
  updatedAt: string;
}

// Mirrors com.tiffin.dto.MenuItemRequest — used for both create and update
export interface MenuItemRequest {
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  isVeg: boolean; // getIsVeg()/setIsVeg() -> "get" prefix, NOT stripped -> "isVeg"
}