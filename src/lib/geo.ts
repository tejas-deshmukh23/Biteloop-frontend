// Haversine formula — great-circle distance between two lat/long points,
// in kilometers. Matches the unit Provider.deliveryRadiusKm is stored in.
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Whether a provider is within range of a customer's location.
// Deliberately permissive (returns true / "don't block") whenever we
// can't determine an answer — missing provider coordinates, missing
// radius, pickup-only providers, or an unknown customer location all
// fall through to "not blocked", since we should never punish a
// provider or customer for data that simply doesn't exist yet.
export function isWithinDeliveryRange(
  customerLat: number | null,
  customerLng: number | null,
  provider: {
    latitude: number | null;
    longitude: number | null;
    deliveryRadiusKm: number | null;
    deliveryAvailable: boolean;
  }
): boolean {
  if (!provider.deliveryAvailable) return true;
  if (
    provider.latitude == null ||
    provider.longitude == null ||
    provider.deliveryRadiusKm == null
  ) {
    return true;
  }
  if (customerLat == null || customerLng == null) return true;

  return (
    distanceKm(customerLat, customerLng, provider.latitude, provider.longitude) <=
    provider.deliveryRadiusKm
  );
}