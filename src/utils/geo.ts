import type { Location } from "@/types/location";
import { toNumber } from "./numbers";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

/** Radio por defecto para considerar que estás en un lugar ya guardado. */
export const NEARBY_RADIUS_METERS = 100;

/** Pide la posición actual del navegador. Requiere HTTPS (o localhost). */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Tu navegador no soporta geolocalización."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => {
        const messages: Record<number, string> = {
          1: "No nos diste permiso para acceder a tu ubicación.",
          2: "No pudimos determinar tu ubicación.",
          3: "Tardó demasiado en obtener tu ubicación.",
        };
        reject(new Error(messages[error.code] ?? "No pudimos obtener tu ubicación."));
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  });
}

/**
 * Link a Google Maps para un lugar con coordenadas.
 * Devuelve null si el lugar no las tiene cargadas.
 */
export function getMapsUrl(
  latitude?: string | number | null,
  longitude?: string | number | null,
): string | null {
  if (latitude == null || longitude == null) return null;

  const lat = toNumber(latitude);
  const lng = toNumber(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Distancia en metros entre dos coordenadas (fórmula de Haversine). */
export function distanceInMeters(a: Coordinates, b: Coordinates): number {
  const EARTH_RADIUS = 6_371_000;
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h));
}

/**
 * Lugar guardado más cercano a una posición, dentro del radio.
 * Ignora los lugares que no tienen coordenadas cargadas.
 */
export function findNearbyLocation(
  locations: Location[],
  position: Coordinates,
  radiusMeters: number = NEARBY_RADIUS_METERS,
): { location: Location; distance: number } | null {
  let best: { location: Location; distance: number } | null = null;

  for (const location of locations) {
    if (location.latitude == null || location.longitude == null) continue;

    const distance = distanceInMeters(position, {
      latitude: toNumber(location.latitude),
      longitude: toNumber(location.longitude),
    });

    if (distance <= radiusMeters && (best === null || distance < best.distance)) {
      best = { location, distance };
    }
  }

  return best;
}
