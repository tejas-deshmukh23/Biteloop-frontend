import { create } from "zustand";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  source: "geolocation" | "manual" | null;
  permissionDenied: boolean;
  setLocation: (lat: number, lng: number, source: "geolocation" | "manual") => void;
  setPermissionDenied: (denied: boolean) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  source: null,
  permissionDenied: false,
  setLocation: (latitude, longitude, source) => set({ latitude, longitude, source }),
  setPermissionDenied: (denied) => set({ permissionDenied: denied }),
  clearLocation: () => set({ latitude: null, longitude: null, source: null }),
}));