import { useMemo, useState, JSX } from "react";
import Button from "@/components/ui/Button";
import type { Account } from "@/types/account";
import type { Category } from "@/types/category";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { useUpdateTransaction } from "@/hooks/mutations/useUpdateTransaction";
import { useLocationsQuery } from "@/hooks/queries/useLocationsQuery";
import { useCreateLocation } from "@/hooks/mutations/useCreateLocation";
import { Transaction } from "@/types/transaction";
import {
  getCurrentPosition,
  findNearbyLocation,
  type Coordinates,
} from "@/utils/geo";
import { MapPin } from "lucide-react";


type TransactionFormValues = Pick<Transaction,
  'concept' | 'amount' | 'date' | 'account_id' | 'category_id' | 'type_id' | 'location_id'>;

const NEW_LOCATION = "__new__";

type TransactionFormProps = {
  readonly accounts: Account[];
  readonly categories: Category[];
  readonly mode?: "create" | "edit";
  readonly transactionId?: string;
  readonly initialValues?: TransactionFormValues;
  readonly onSuccess?: () => void;
};

const TRANSACTION_TYPES = [
  { id: "2bc1382d-90b2-45ae-b91f-e7d3fd155b2d", label: "Gasto" },
  { id: "e0c36d0a-85ef-4fb6-a1f6-9480a17ed68f", label: "Ingreso" },
];

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TransactionForm({
  accounts,
  categories,
  mode = "create",
  transactionId,
  initialValues,
  onSuccess,
}: TransactionFormProps): JSX.Element {
  const { mutateAsync: createMutate, isPending: isCreating } = useCreateTransaction();
  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdateTransaction();

  const isPending = isCreating || isUpdating;

  const [amount, setAmount] = useState(initialValues?.amount.toString() ?? "");
  const [concept, setConcept] = useState(initialValues?.concept ?? "");
  const [date, setDate] = useState(initialValues?.date ?? todayDate());
  const [typeId, setTypeId] = useState(initialValues?.type_id ?? "2bc1382d-90b2-45ae-b91f-e7d3fd155b2d");
  const [accountId, setAccountId] = useState(initialValues?.account_id ?? "");
  const [categoryId, setCategoryId] = useState(initialValues?.category_id ?? "");
  const [locationId, setLocationId] = useState(initialValues?.location_id ?? "");
  const [newLocationName, setNewLocationName] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: locations = [] } = useLocationsQuery();
  const { mutateAsync: createLocation } = useCreateLocation();
  const isCreatingLocation = locationId === NEW_LOCATION;

  // Geolocalización: coordenadas capturadas para el lugar nuevo
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  async function handleUseCurrentPosition() {
    setIsLocating(true);
    setGeoMessage(null);

    try {
      const position = await getCurrentPosition();
      const nearby = findNearbyLocation(locations, position);

      if (nearby) {
        // Ya tenés un lugar guardado acá: se selecciona
        setLocationId(nearby.location.id);
        setCoords(null);
        setGeoMessage(
          `Estás en ${nearby.location.name} (a ${Math.round(nearby.distance)} m).`,
        );
      } else {
        // Lugar nuevo: se guardan las coordenadas y falta el nombre
        setLocationId(NEW_LOCATION);
        setCoords(position);
        setGeoMessage("Lugar nuevo: ponele un nombre y se guarda con tus coordenadas.");
      }
    } catch (error) {
      setGeoMessage(
        error instanceof Error ? error.message : "No pudimos obtener tu ubicación.",
      );
    } finally {
      setIsLocating(false);
    }
  }

  const filteredCategories = useMemo(() => {
    const type = typeId === "2bc1382d-90b2-45ae-b91f-e7d3fd155b2d" ? "EXPENSE" : "INCOME";
    return categories.filter((category) => category.type === type);
  }, [categories, typeId]);

  const parsedAmount = Number(amount);

  const isValid =
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    accountId.trim().length > 0 &&
    date.trim().length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    try {
      setSubmitError(null);

      // Si eligió "nuevo lugar", se crea primero y se usa su id
      let resolvedLocationId: string | undefined = locationId || undefined;

      if (isCreatingLocation) {
        const name = newLocationName.trim();
        if (!name) {
          setSubmitError("Poné un nombre para el lugar nuevo.");
          return;
        }
        const created = await createLocation({
          name,
          latitude: coords?.latitude ?? null,
          longitude: coords?.longitude ?? null,
        });
        resolvedLocationId = created.id;
      }

      const payload = {
        amount: parsedAmount,
        concept: concept.trim() || undefined,
        date: date + "T00:00:00.000Z",
        account_id: accountId,
        category_id: categoryId || undefined,
        type_id: typeId,
        location_id: resolvedLocationId ?? null,
      };

      if (mode === "edit") {
        if (!transactionId) {
          throw new Error("El transactionId es requerido en modo edición.");
        }

        await updateMutate({ id: transactionId, data: payload });
      } else {
        await createMutate(payload);

        setAmount("");
        setConcept("");
        setDate(todayDate());
        setTypeId("2bc1382d-90b2-45ae-b91f-e7d3fd155b2d");
        setAccountId("");
        setCategoryId("");
        setLocationId("");
        setNewLocationName("");
        setCoords(null);
        setGeoMessage(null);
      }

      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message :
        mode === "edit" ? "No pudimos actualizar el movimiento." : "No pudimos guardar el movimiento.";
      console.log(error);
      setSubmitError(message);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {submitError && (
        <div className="rounded-lg border border-[var(--color-expense-bg)] bg-[var(--color-expense-bg)] px-3 py-2 text-sm text-[var(--color-expense-text)]">
          {submitError}
        </div>
      )}

      <div>
        <label htmlFor="amount" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Monto
        </label>
        <input
          type="number"
          name="amount"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-lg"
          placeholder="0"
        />
      </div>

      <div>
        <label htmlFor="type" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Tipo
        </label>
        <select
          name="type"
          value={typeId}
          onChange={(e) => {
            setTypeId(e.target.value);
            setCategoryId("");
          }}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
        >
          {TRANSACTION_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="account" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Cuenta
        </label>
        <select
          name="account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
        >
          <option value="">Seleccionar cuenta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Categoría
        </label>
        <select
          value={categoryId}
          name="category"
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
        >
          <option value="">Sin categoría</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="concept" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Concepto
        </label>
        <input
          type="text"
          name="concept"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          placeholder="Ej: Supermercado"
        />
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Fecha
        </label>
        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <label htmlFor="location" className="block text-sm font-medium text-[var(--color-ink)]">
            Lugar
          </label>

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

        <select
          name="location"
          value={locationId ?? ""}
          onChange={(e) => setLocationId(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
        >
          <option value="">Sin lugar</option>
          {locations.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
          <option value={NEW_LOCATION}>+ Agregar lugar nuevo...</option>
        </select>

        {isCreatingLocation && (
          <input
            type="text"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
            placeholder="Nombre del lugar (ej: Chango Más Chacras)"
            autoFocus
          />
        )}

        {geoMessage && (
          <p className="mt-1 text-xs text-[var(--color-muted)]">{geoMessage}</p>
        )}

        {isCreatingLocation && coords && (
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Coordenadas: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
          </p>
        )}
      </div>

      <Button type="submit" fullWidth disabled={!isValid || isPending}>
        {isPending ? "Guardando..." : "Guardar movimiento"}
      </Button>
    </form>
  );
}