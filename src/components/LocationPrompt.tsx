"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocationStore } from "@/lib/store/locationStore";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-xl bg-[#2B2013]/5 animate-pulse flex items-center justify-center text-sm text-[#2B2013]/40">
      Loading map...
    </div>
  ),
});

export default function LocationPrompt() {
  const { latitude, longitude, source, setLocation, clearLocation } = useLocationStore();
  const [locating, setLocating] = useState(false);
  const [showManualPicker, setShowManualPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported on this device — set your location manually instead.");
      setShowManualPicker(true);
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude, "geolocation");
        setLocating(false);
      },
      () => {
        setError("Couldn't access your location — set it manually instead.");
        setLocating(false);
        setShowManualPicker(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (latitude != null && longitude != null) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#55713C]/25 bg-[#55713C]/8 px-4 py-3 mb-6 text-sm">
        <span className="text-[#3f5a2c] font-medium">
          📍 Showing kitchens that deliver to your {source === "geolocation" ? "current" : "selected"} location
        </span>
        <button
          onClick={clearLocation}
          className="text-[#2B2013]/50 hover:text-[#B23A2E] transition-colors font-medium shrink-0"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#D89B2C]/25 bg-[#D89B2C]/8 px-4 py-3 mb-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm text-[#2B2013]/70">
          📍 Set your location to see which kitchens can deliver to you
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleUseMyLocation}
            disabled={locating}
            className="text-sm font-medium text-white bg-[#D89B2C] px-3 py-1.5 rounded-full hover:bg-[#c78d26] disabled:opacity-50 transition-colors"
          >
            {locating ? "Locating..." : "Use my location"}
          </button>
          <button
            onClick={() => setShowManualPicker(true)}
            className="text-sm font-medium text-[#2B2013]/70 border border-[#2B2013]/15 px-3 py-1.5 rounded-full hover:border-[#2B2013]/30 transition-colors"
          >
            Set manually
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

      {showManualPicker && (
        <div className="mt-3">
          <LocationPicker
            latitude={null}
            longitude={null}
            onChange={(lat, lng) => {
              setLocation(lat, lng, "manual");
              setShowManualPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
}