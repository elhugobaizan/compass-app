import { useMemo, useState, JSX } from "react";
import Button from "@/components/ui/Button";
import type { Account } from "@/types/account";
import type { Category } from "@/types/category";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { useUpdateTransaction } from "@/hooks/mutations/useUpdateTransaction";

type TransactionFormValues = {
  concept?: string;
  amount: number;
  date: string;
  account_id: string;
  category_id?: string;
  type_id: string;
  location?: string;
};

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
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [submitError, setSubmitError] = useState<string | null>(null);

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

    const payload = {
      amount: parsedAmount,
      concept: concept.trim() || undefined,
      date: date + "T00:00:00.000Z",
      account_id: accountId,
      category_id: categoryId || undefined,
      type_id: typeId,
      location: location.trim() || undefined,
    };

    try {
      setSubmitError(null);

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
        setLocation("");
      }

      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message :
        mode === "edit" ? "Error al actualizar el movimiento." : "Error al crear el movimiento.";
      console.log(error);
      setSubmitError(message);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div>
        <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
          Monto
        </label>
        <input
          type="number"
          name="amount"
          inputMode="decimal"
          step="0.1"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-lg"
          placeholder="0"
        />
      </div>

      <div>
        <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">
          Tipo
        </label>
        <select
          name="type"
          value={typeId}
          onChange={(e) => {
            setTypeId(e.target.value);
            setCategoryId("");
          }}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        >
          {TRANSACTION_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="account" className="mb-1 block text-sm font-medium text-gray-700">
          Cuenta
        </label>
        <select
          name="account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
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
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          value={categoryId}
          name="category"
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
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
        <label htmlFor="concept" className="mb-1 block text-sm font-medium text-gray-700">
          Concepto
        </label>
        <input
          type="text"
          name="concept"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: Supermercado"
        />
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
          Fecha
        </label>
        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
          Ubicación
        </label>
        <input
          type="text"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Opcional"
        />
      </div>

      <Button type="submit" fullWidth disabled={!isValid || isPending}>
        {isPending ? "Guardando..." : "Guardar movimiento"}
      </Button>
    </form>
  );
}