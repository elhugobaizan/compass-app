import { useMemo, useState, JSX } from "react";
import Button from "@/components/ui/Button";
import type { Account } from "@/types/account";
import { useCreateTransfer } from "@/hooks/mutations/useCreateTransfer";

type TransferFormProps = {
  readonly accounts: Account[];
  readonly onSuccess?: () => void;
};

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TransferForm({
  accounts,
  onSuccess,
}: TransferFormProps): JSX.Element {
  const { mutateAsync, isPending } = useCreateTransfer();

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayDate());
  const [originAccountId, setOriginAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [concept, setConcept] = useState("");
  const [location, setLocation] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const parsedAmount = Number(amount);

  const originAccount = useMemo(
    () => accounts.find((account) => account.id === originAccountId),
    [accounts, originAccountId]
  );

  const destinationOptions = useMemo(() => {
    if (!originAccountId) return accounts;

    return accounts.filter((account) => account.id !== originAccountId);
  }, [accounts, originAccountId]);

  const sameCurrencyDestinationOptions = useMemo(() => {
    if (!originAccount) return destinationOptions;

    return destinationOptions.filter(
      (account) => account.currency === originAccount.currency
    );
  }, [destinationOptions, originAccount]);

  const isValid =
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    originAccountId.trim().length > 0 &&
    destinationAccountId.trim().length > 0 &&
    originAccountId !== destinationAccountId &&
    date.trim().length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    try {
      setSubmitError(null);

      await mutateAsync({
        amount: parsedAmount,
        date,
        origin_account_id: originAccountId,
        destination_account_id: destinationAccountId,
        concept: concept.trim() || undefined,
        location: location.trim() || undefined,
      });

      setAmount("");
      setDate(todayDate());
      setOriginAccountId("");
      setDestinationAccountId("");
      setConcept("");
      setLocation("");

      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No pudimos registrar la transferencia.";

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
          name="amount"
          type="number"
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
        <label htmlFor="originAccount" className="mb-1 block text-sm font-medium text-gray-700">
          Cuenta origen
        </label>
        <select
          name="originAccount"
          value={originAccountId}
          onChange={(e) => {
            setOriginAccountId(e.target.value);
            setDestinationAccountId("");
          }}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        >
          <option value="">Seleccionar cuenta origen</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.currency})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="destinationAccount" className="mb-1 block text-sm font-medium text-gray-700">
          Cuenta destino
        </label>
        <select
          name="destinationAccount"
          value={destinationAccountId}
          onChange={(e) => setDestinationAccountId(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          disabled={!originAccountId}
        >
          <option value="">Seleccionar cuenta destino</option>
          {sameCurrencyDestinationOptions.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.currency})
            </option>
          ))}
        </select>
      </div>

      {originAccountId && sameCurrencyDestinationOptions.length === 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          No hay cuentas destino disponibles con la misma moneda.
        </div>
      )}

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
          Fecha
        </label>
        <input
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="concept" className="mb-1 block text-sm font-medium text-gray-700">
          Concepto
        </label>
        <input
          name="concept"
          type="text"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: Transferencia a ahorro"
        />
      </div>

      <div>
        <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
          Ubicación
        </label>
        <input
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Opcional"
        />
      </div>

      <Button type="submit" fullWidth disabled={!isValid || isPending}>
        {isPending ? "Transfiriendo..." : "Guardar transferencia"}
      </Button>
    </form>
  );
}