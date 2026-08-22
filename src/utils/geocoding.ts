import type { Coordinates } from "./geo";

/**
 * Geocodificación con Nominatim, el buscador de OpenStreetMap.
 * Es gratis y sin API key, pero tiene una política de uso: máximo 1 pedido por
 * segundo y hay que identificar la app. Como acá se busca a mano (Enter), el
 * límite no llega a rozarse.
 */
export type GeocodeResult = {
  readonly label: string;
  readonly coordinates: Coordinates;
};

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// Sesga los resultados a Mendoza: los lugares que se cargan acá son de acá
const DEFAULT_VIEWBOX = "-69.05,-33.10,-68.70,-32.80";

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<GeocodeResult[]> {
  const term = query.trim();
  if (term.length < 3) return [];

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", term);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "0");
  url.searchParams.set("countrycodes", "ar");
  url.searchParams.set("viewbox", DEFAULT_VIEWBOX);
  // bounded=0: si no hay nada en Mendoza, igual busca en el resto del país
  url.searchParams.set("bounded", "0");

  const response = await fetch(url.toString(), {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("No pudimos buscar la dirección.");
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => {
      const row = item as { display_name?: unknown; lat?: unknown; lon?: unknown };
      const latitude = Number(row.lat);
      const longitude = Number(row.lon);

      if (
        typeof row.display_name !== "string" ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return null;
      }

      return {
        label: row.display_name,
        coordinates: { latitude, longitude },
      };
    })
    .filter((r): r is GeocodeResult => r !== null);
}
