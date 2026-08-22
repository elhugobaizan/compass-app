import { JSX, Suspense, lazy, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/services/api";
import { MapPin, Search, X } from "lucide-react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useCreateLocation } from "@/hooks/mutations/useCreateLocation";
import { useUpdateLocation } from "@/hooks/mutations/useUpdateLocation";
import { getCurrentPosition, type Coordinates } from "@/utils/geo";
import { searchPlaces, type GeocodeResult } from "@/utils/geocoding";
import type { Location } from "@/types/location";

// Leaflet pesa ~45KB: sólo se baja cuando se abre el sheet
const LocationMapPicker = lazy(
  () => import("@/components/finance/locations/LocationMapPicker"),
);

type LocationSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  /** Si viene, es edición; si no, alta. */
  readonly location?: Location | null;
};

function toCoordinates(location: Location | null): Coordinates | null {
  if (!location || location.latitude == null || location.longitude == null) {
    return null;
  }

  return {
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
  };
}

export default function LocationSheet({
  open,
  onClose,
  location = null,
}: LocationSheetProps): JSX.Element {
  const isEdit = !!location;

  const { mutateAsync: createLocation, isPending: isCreating } = useCreateLocation();
  const { mutateAsync: updateLocation, isPending: isUpdating } = useUpdateLocation();
  const isPending = isCreating || isUpdating;

  const [name, setName] = useState("");
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Avisa cuando el marcador lo puso el GPS y no el usuario
  const [autoPlaced, setAutoPlaced] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;

    const existing = toCoordinates(location);

    setName(location?.name ?? "");
    setCoords(existing);
    setMapCenter(existing);
    setAutoPlaced(false);
    setError(null);
    setQuery("");
    setResults([]);

    // Sin coordenadas guardadas: se arranca en la posición actual
    if (existing) return;

    let cancelled = false;

    getCurrentPosition()
      .then((position) => {
        if (cancelled) return;
        setCoords(position);
        setMapCenter(position);
        setAutoPlaced(true);
      })
      .catch(() => {
        // Permiso denegado o sin GPS: el mapa cae al centro por defecto
      });

    return () => {
      cancelled = true;
    };
  }, [open, location]);

  useEffect(() => {
    return () => searchAbortRef.current?.abort();
  }, []);

  function handlePickCoordinates(next: Coordinates) {
    setCoords(next);
    setAutoPlaced(false);
  }

  async function handleUseCurrentPosition() {
    setIsLocating(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      setCoords(position);
      setMapCenter(position);
      setAutoPlaced(false);
    } catch (e) {
      setError(getErrorMessage(e, "No pudimos obtener tu ubicación."));
    } finally {
      setIsLocating(false);
    }
  }

  async function handleSearch(event: React.FormEvent) {
    // El buscador vive dentro del <form> del sheet: sin esto, Enter guardaría
    event.preventDefault();
    event.stopPropagation();

    if (query.trim().length < 3) return;

    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;

    setIsSearching(true);
    setError(null);

    try {
      const found = await searchPlaces(query, controller.signal);
      setResults(found);

      if (found.length === 0) {
        setError("No encontramos esa dirección. Probá moviendo el marcador a mano.");
      }
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(getErrorMessage(e, "No pudimos buscar la dirección."));
    } finally {
      if (!controller.signal.aborted) setIsSearching(false);
    }
  }

  function handlePickResult(result: GeocodeResult) {
    setCoords(result.coordinates);
    setMapCenter(result.coordinates);
    setAutoPlaced(false);
    setResults([]);
    setQuery("");
  }

  function handleClearCoordinates() {
    setCoords(null);
    setAutoPlaced(false);
  }

  const isValid = name.trim().length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    const payload = {
      name: name.trim(),
      latitude: coords ? coords.latitude : null,
      longitude: coords ? coords.longitude : null,
    };

    try {
      setError(null);

      if (isEdit && location) {
        await updateLocation({ id: location.id, data: payload });
      } else {
        await createLocation(payload);
      }

      onClose();
    } catch (e) {
      setError(getErrorMessage(e, "No pudimos guardar el lugar."));
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Editar lugar" : "Nuevo lugar"}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg border border-[var(--color-expense-bg)] bg-[var(--color-expense-bg)] px-3 py-2 text-sm text-[var(--color-expense-text)]">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
            placeholder="Ej: Chango Más Chacras"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">
              Ubicación en el mapa
            </span>

            <div className="flex items-center gap-1">
              {coords && (
                <button
                  type="button"
                  onClick={handleClearCoordinates}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-paper)]"
                >
                  <X className="h-3.5 w-3.5" />
                  Quitar
                </button>
              )}

              <button
                type="button"
                onClick={handleUseCurrentPosition}
                disabled={isLocating}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs font-medium text-[var(--color-accent-text)] transition-colors hover:bg-[var(--color-accent-bg)] disabled:opacity-50"
              >
                <MapPin className="h-3.5 w-3.5" />
                {isLocating ? "Ubicando..." : "Usar mi ubicación"}
              </button>
            </div>
          </div>

          {/* Buscador de direcciones (Nominatim / OpenStreetMap) */}
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(e);
              }}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
              placeholder="Buscar una dirección..."
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching || query.trim().length < 3}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-accent-text)] transition-colors hover:bg-[var(--color-accent-bg)] disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              {isSearching ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {results.length > 0 && (
            <ul className="mb-2 divide-y divide-[var(--color-border)] overflow-hidden rounded-lg border border-[var(--color-border)]">
              {results.map((result) => (
                <li key={`${result.coordinates.latitude},${result.coordinates.longitude}`}>
                  <button
                    type="button"
                    onClick={() => handlePickResult(result)}
                    className="w-full px-3 py-2 text-left text-xs text-[var(--color-ink)] transition-colors hover:bg-[var(--color-accent-bg)]"
                  >
                    {result.label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Suspense
            fallback={
              <div className="flex h-[260px] w-full items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] text-sm text-[var(--color-muted)]">
                Cargando mapa...
              </div>
            }
          >
            <LocationMapPicker
              value={coords}
              onChange={handlePickCoordinates}
              initialCenter={mapCenter}
            />
          </Suspense>

          {autoPlaced && (
            <p className="mt-1 text-xs text-[#8A5A2E]">
              Marcador puesto en tu posición actual. Movelo si no es acá, o tocá
              &quot;Quitar&quot; para dejar el lugar sin ubicación.
            </p>
          )}

          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {coords ? (
              <>
                {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)} · tocá el
                mapa o arrastrá el marcador para ajustarlo.
              </>
            ) : (
              <>
                Sin ubicación. Tocá el mapa para ponerle una: así el lugar se detecta
                solo cuando estás cerca.
              </>
            )}
          </p>
        </div>

        <Button type="submit" fullWidth disabled={!isValid || isPending}>
          {isPending ? "Guardando..." : "Guardar lugar"}
        </Button>
      </form>
    </Modal>
  );
}
