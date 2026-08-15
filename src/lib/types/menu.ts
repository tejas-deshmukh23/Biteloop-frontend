export interface MenuItem {
  id: string;
  providerId: string;
  name: string;
  description: string | null;
  price: number;
  category: string; // TODO: narrow to MenuCategory union once enum values confirmed
  veg: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}