"use client";

import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker icon paths break under bundlers — pointing
// directly at the CDN's image assets sidesteps needing webpack/Turbopack
// asset-copying configuration entirely.
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER: [number, number] = [18.5204, 73.8567]; // Pune — matches your current market

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// MapContainer's center/zoom props only apply on initial mount — react-leaflet
// doesn't re-center automatically when they change later, so recentering
// after "Use my current location" needs to go through the map instance
// directly via useMap(), inside an effect (not during render).
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return null;
}

export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const position: [number, number] | null =
    latitude != null && longitude != null ? [latitude, longitude] : null;

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocateError("Geolocation isn't supported on this device");
      return;
    }

    setLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocateError(
          "Couldn't access your location — check permissions, or tap the map to set it manually"
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onChange]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">Business location</label>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          className="text-xs font-medium text-[#B23A2E] hover:text-[#963025] disabled:opacity-50"
        >
          {locating ? "Locating..." : "Use my current location"}
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-[#2B2013]/15 h-64">
        <MapContainer
          center={position ?? DEFAULT_CENTER}
          zoom={position ? 15 : 12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          {position && <FlyToLocation position={position} />}
          {position && <Marker position={position} icon={markerIcon} />}
        </MapContainer>
      </div>

      <p className="text-xs text-[#2B2013]/45 mt-1.5">
        Tap the map to set your business location, or use the button above.
      </p>

      {locateError && <p className="text-red-600 text-xs mt-1">{locateError}</p>}
    </div>
  );
}