import { useState, JSX } from "react";
import Button from "@/components/ui/Button";
import { useCreateAccount } from "@/hooks/mutations/useCreateAccount";
import {
  ACCOUNT_GROUP_OPTIONS,
  ACCOUNT_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
} from "@/types/accountGroup";

type AccountFormProps = {
  readonly onSuccess?: () => void;
};

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatErrorMessage(input: unknown): string {
  console.log(typeof input);
  if (typeof input !== "string") {
    return String("No pudimos guardar la cuenta.");
  }

  const trimmed = input.trim();

  // Solo intenta parsear si parece HTML
  if (
    trimmed.includes("<!DOCTYPE html>") ||
    trimmed.includes("<html")
  ) {
    const match = trimmed.match(/<pre>([\s\S]*?)<\/pre>/i);
    if (match?.[1]) {
      return match[1].trim();
    } else {
      return "No pudimos guardar la cuenta.";
    }
  }

  return trimmed;
}

export default function AccountForm({
  onSuccess,
}: AccountFormProps): JSX.Element {
  const { mutateAsync, isPending } = useCreateAccount();

  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("WALLET");
  const [accountGroupId, setAccountGroupId] = useState("");
  const [currency, setCurrency] = useState("ARS");
  const [institution, setInstitution] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [openingDate, setOpeningDate] = useState(todayDate());
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const parsedOpeningBalance =
    openingBalance.trim() === "" ? undefined : Number(openingBalance);

  const isValid =
    name.trim().length > 0 &&
    accountType.trim().length > 0 &&
    currency.trim().length > 0 &&
    accountGroupId.trim().length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    try {
      setSubmitError(null);

      await mutateAsync({
        name: name.trim(),
        account_type: accountType,
        account_group_id: accountGroupId,
        currency,
        institution: institution.trim() || undefined,
        opening_balance:
          parsedOpeningBalance !== undefined &&
          Number.isFinite(parsedOpeningBalance)
            ? parsedOpeningBalance
            : undefined,
        opening_date: openingDate || undefined,
        is_payment_method: isPaymentMethod,
      });

      setName("");
      setAccountType("WALLET");
      setAccountGroupId("");
      setCurrency("ARS");
      setInstitution("");
      setOpeningBalance("");
      setOpeningDate(todayDate());
      setIsPaymentMethod(false);

      onSuccess?.();
    } catch (error) {
      const message = formatErrorMessage(error);

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
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: Lemon Wallet, ICBC Caja USD"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Institución
        </label>
        <input
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: Lemon, ICBC"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          >
            {ACCOUNT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="group" className="mb-1 block text-sm font-medium text-gray-700">
            Grupo
          </label>
          <select
            name="group"
            value={accountGroupId}
            onChange={(e) => setAccountGroupId(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          >
            {ACCOUNT_GROUP_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Moneda
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Saldo inicial
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Fecha inicial
        </label>
        <input
          type="date"
          value={openingDate}
          onChange={(e) => setOpeningDate(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isPaymentMethod}
          onChange={(e) => setIsPaymentMethod(e.target.checked)}
          className="rounded border-gray-300"
        />
        Es método de pago
      </label>

      <Button type="submit" fullWidth disabled={!isValid || isPending}>
        {isPending ? "Guardando..." : "Guardar cuenta"}
      </Button>
    </form>
  );
}