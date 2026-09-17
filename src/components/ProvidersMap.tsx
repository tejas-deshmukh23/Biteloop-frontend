"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { Provider } from "@/lib/types/provider";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER: [number, number] = [18.5204, 73.8567]; // Pune

// Best-effort, silent recenter toward the visitor's own location if they've
// already granted permission somewhere — never prompts, and never shows an
// error if denied, since the person never explicitly asked for this.
function RecenterOnUser() {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 13);
      },
      () => {
        // Silent — default center stays.
      }
    );
  }, [map]);

  return null;
}

export default function ProvidersMap({ providers }: { providers: Provider[] }) {
  const pinned = providers.filter((p) => p.latitude != null && p.longitude != null);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#2B2013]/10 h-[420px]">
      <MapContainer center={DEFAULT_CENTER} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterOnUser />
        {pinned.map((provider) => (
          <Marker
            key={provider.id}
            position={[provider.latitude as number, provider.longitude as number]}
            icon={markerIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold mb-1">{provider.businessName}</p>
                <p className="text-xs text-gray-600 mb-2">{provider.address}</p>
                <Link href={`/providers/${provider.id}`} className="text-[#B23A2E] font-medium text-xs">
                  View menu →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {pinned.length === 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs text-[#2B2013]/60 shadow-lg">
          No kitchens have set their location yet
        </div>
      )}
    </div>
  );
}