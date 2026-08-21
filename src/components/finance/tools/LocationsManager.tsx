import { JSX, useState } from "react";
import { MapPin, Pencil, Trash2, ExternalLink } from "lucide-react";

import SectionBlock from "@/components/ui/SectionBlock";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { useLocationsQuery } from "@/hooks/queries/useLocationsQuery";
import { useDeleteLocation } from "@/hooks/mutations/useDeleteLocation";
import { getMapsUrl } from "@/utils/geo";
import { toNumber } from "@/utils/numbers";
import type { Location } from "@/types/location";

import LocationSheet from "@/components/finance/locations/LocationSheet";

type LocationsManagerProps = {
  readonly isMobile: boolean;
};

export default function LocationsManager({
  isMobile,
}: LocationsManagerProps): JSX.Element {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState<Location | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

  const { data: locations = [], isLoading, isError } = useLocationsQuery();
  const { mutateAsync: deleteLocation, isPending: isDeleting } = useDeleteLocation();

  async function handleConfirmDelete() {
    if (!locationToDelete) return;
    await deleteLocation(locationToDelete.id);
    setLocationToDelete(null);
  }

  const sorted = [...locations].sort((a, b) => a.name.localeCompare(b.name));
  const withCoords = sorted.filter((l) => l.latitude != null && l.longitude != null);

  return (
    <SectionBlock
      title="Lugares"
      subtitle={
        isLoading || isError || sorted.length === 0
          ? undefined
          : `${sorted.length} ${sorted.length === 1 ? "lugar" : "lugares"} · ${withCoords.length} con ubicación en el mapa`
      }
      action={<Button onClick={() => setIsCreateOpen(true)}>+ Lugar</Button>}
    >
      <div className="space-y-4">
        {isLoading && (
          <p className="text-sm text-[var(--color-muted)]">Cargando lugares...</p>
        )}

        {isError && (
          <EmptyState
            title="No pudimos cargar los lugares"
            description="Revisá la conexión o el backend e intentá de nuevo."
            variant="error"
          />
        )}

        {!isLoading && !isError && sorted.length === 0 && (
          <EmptyState
            title="Todavía no hay lugares"
            description="Creá tu primer lugar o agregalo al cargar un movimiento."
            action={<Button onClick={() => setIsCreateOpen(true)}>+ Lugar</Button>}
          />
        )}

        {!isLoading && !isError && sorted.length > 0 && (
          <ul className="divide-y divide-[var(--color-border)] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
            {sorted.map((location) => {
              const mapsUrl = getMapsUrl(location.latitude, location.longitude);

              return (
                <li
                  key={location.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={
                        mapsUrl
                          ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-bg)]"
                          : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-paper)]"
                      }
                    >
                      <MapPin
                        className={
                          mapsUrl
                            ? "h-4 w-4 text-[var(--color-accent-text)]"
                            : "h-4 w-4 text-[var(--color-muted)]"
                        }
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                        {location.name}
                      </p>

                      {mapsUrl ? (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--color-accent-text)] hover:underline"
                        >
                          {toNumber(location.latitude).toFixed(5)},{" "}
                          {toNumber(location.longitude).toFixed(5)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <p className="text-xs text-[var(--color-muted)]">
                          Sin ubicación en el mapa
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setLocationToEdit(location)}
                    >
                      <Pencil className={isMobile ? "h-3.5 w-3.5" : "mr-1 h-3.5 w-3.5"} />
                      {!isMobile && "Editar"}
                    </Button>

                    <Button
                      variant="danger-ghost"
                      size="sm"
                      onClick={() => setLocationToDelete(location)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <LocationSheet open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <LocationSheet
        open={!!locationToEdit}
        location={locationToEdit}
        onClose={() => setLocationToEdit(null)}
      />

      <ConfirmDialog
        open={!!locationToDelete}
        title="Eliminar lugar"
        description="Los movimientos que lo tengan asignado van a quedar sin lugar."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        confirmVariant="danger"
        isLoading={isDeleting}
        onClose={() => setLocationToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </SectionBlock>
  );
}
