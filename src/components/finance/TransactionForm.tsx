import { useMemo, useState, JSX } from "react";
import Button from "@/components/ui/Button";
import type { Account } from "@/types/account";
import type { Category } from "@/types/category";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";

type TransactionFormProps = {
  readonly accounts: Account[];
  readonly categories: Category[];
  readonly onSuccess?: () => void;
};

const TRANSACTION_TYPES = [
  { id: "1", label: "Gasto" },
  { id: "2", label: "Ingreso" },
];

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TransactionForm({
  accounts,
  categories,
  onSuccess,
}: TransactionFormProps): JSX.Element {
  const { mutateAsync, isPending } = useCreateTransaction();

  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [date, setDate] = useState(todayDate());
  const [typeId, setTypeId] = useState("1");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const type = typeId === "1" ? "EXPENSE" : "INCOME";
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

      await mutateAsync({
        amount: parsedAmount,
        concept: concept.trim() || undefined,
        date: date + "T00:00:00.000Z",
        account_id: accountId,
        category_id: categoryId || undefined,
        type_id: typeId,
        location: location.trim() || undefined,
      });

      setAmount("");
      setConcept("");
      setDate(todayDate());
      setTypeId("1");
      setAccountId("");
      setCategoryId("");
      setLocation("");

      onSuccess?.();
    } catch (error) {
      console.log(error);
      setSubmitError("No pudimos guardar el movimiento.");
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
          step="0.01"
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