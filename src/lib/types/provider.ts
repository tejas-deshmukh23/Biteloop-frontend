export type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Provider {
  id: string;
  ownerId: string;
  businessName: string;
  description: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  deliveryRadiusKm: number | null;
  deliveryAvailable: boolean;
  status: ProviderStatus;
  isActive: boolean;
  createdAt: string;
}