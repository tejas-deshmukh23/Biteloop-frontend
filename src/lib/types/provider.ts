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

export interface CreateProviderRequest {
  businessName: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  deliveryRadiusKm?: number;
  deliveryAvailable: boolean;
}