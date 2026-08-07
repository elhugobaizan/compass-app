import { JSX, useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useCreateLocation } from "@/hooks/mutations/useCreateLocation";
import { useUpdateLocation } from "@/hooks/mutations/useUpdateLocation";
import { getCurrentPosition } from "@/utils/geo";
import type { Location } from "@/types/location";

type LocationSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  /** Si viene, es edición; si no, alta. */
  readonly location?: Location | null;
};

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
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(location?.name ?? "");
    setLatitude(location?.latitude != null ? String(location.latitude) : "");
    setLongitude(location?.longitude != null ? String(location.longitude) : "");
    setError(null);
  }, [open, location]);

  async function handleUseCurrentPosition() {
    setIsLocating(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      setLatitude(String(position.latitude));
      setLongitude(String(position.longitude));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos obtener tu ubicación.");
    } finally {
      setIsLocating(false);
    }
  }

  const isValid = name.trim().length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    const payload = {
      name: name.trim(),
      latitude: latitude.trim() === "" ? null : Number(latitude),
      longitude: longitude.trim() === "" ? null : Number(longitude),
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
      setError(e instanceof Error ? e.message : "No pudimos guardar el lugar.");
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

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              placeholder="Latitud"
            />
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
              placeholder="Longitud"
            />
          </div>

          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Opcional. Con coordenadas, el lugar se detecta solo cuando estás cerca.
          </p>
        </div>

        <Button type="submit" fullWidth disabled={!isValid || isPending}>
          {isPending ? "Guardando..." : "Guardar lugar"}
        </Button>
      </form>
    </Modal>
  );
}
