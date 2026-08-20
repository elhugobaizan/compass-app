import { useMemo, useState, JSX } from "react";
import { toId } from "@/utils/ids";
import Button from "@/components/ui/Button";
import type { Account } from "@/types/account";
import { useCreateTransfer } from "@/hooks/mutations/useCreateTransfer";
import AmountField from "@/components/ui/AmountField";
import { evaluateExpression } from "@/utils/calculator";

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
  const [submitError, setSubmitError] = useState<string | null>(null);

  // El monto admite operaciones simples (ej. "1200+800")
  const parsedAmount = evaluateExpression(amount) ?? NaN;

  const originAccount = useMemo(
    () => accounts.find((account) => account.id === toId(originAccountId)),
    [accounts, originAccountId]
  );

  const destinationOptions = useMemo(() => {
    if (!originAccountId) return accounts;

    return accounts.filter((account) => account.id !== toId(originAccountId));
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
        // ISO explícito en UTC, igual que los movimientos normales, para que no
        // se corra el día al guardar (columna timestamp without time zone)
        date: date + "T00:00:00.000Z",
        origin_account_id: Number(originAccountId),
        destination_account_id: Number(destinationAccountId),
        concept: concept.trim() || undefined,
      });

      setAmount("");
      setDate(todayDate());
      setOriginAccountId("");
      setDestinationAccountId("");
      setConcept("");

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
        <div className="rounded-lg border border-[var(--color-expense-bg)] bg-[var(--color-expense-bg)] px-3 py-2 text-sm text-[var(--color-expense-text)]">
          {submitError}
        </div>
      )}

      <AmountField value={amount} onChange={setAmount} />

      <div>
        <label htmlFor="originAccount" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Cuenta origen
        </label>
        <select
          name="originAccount"
          value={originAccountId}
          onChange={(e) => {
            setOriginAccountId(e.target.value);
            setDestinationAccountId("");
          }}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
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
        <label htmlFor="destinationAccount" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Cuenta destino
        </label>
        <select
          name="destinationAccount"
          value={destinationAccountId}
          onChange={(e) => setDestinationAccountId(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
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
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Fecha
        </label>
        <input
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="concept" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
          Concepto
        </label>
        <input
          name="concept"
          type="text"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          placeholder="Ej: Transferencia a ahorro"
        />
      </div>

      <Button type="submit" fullWidth disabled={!isValid || isPending}>
        {isPending ? "Transfiriendo..." : "Guardar transferencia"}
      </Button>
    </form>
  );
}