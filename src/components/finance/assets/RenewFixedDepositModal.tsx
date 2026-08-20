import { useState, JSX } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Asset } from "@/types/asset";
import { useUpdateAsset } from "@/hooks/mutations/useUpdateAsset";
import { addDays, toLocalDateString } from "@/utils/date";
import { toNumber } from "@/utils/numbers";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { TRANSACTION_TYPE_IDS } from "@/utils/transactionTypes";

type RenewFixedDepositModalProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly asset: Asset;
};

export default function RenewFixedDepositModal({
  open,
  onClose,
  asset,
}: RenewFixedDepositModalProps): JSX.Element {
  const today = new Date();
  const defaultStartDate = toLocalDateString(today);
  const defaultMaturity = toLocalDateString(addDays(today, 30));

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [capital, setCapital] = useState(toNumber(asset.capital).toString());
  const [interest, setInterest] = useState(toNumber(asset.interest).toString());
  const [maturity, setMaturity] = useState(defaultMaturity);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registerMovement, setRegisterMovement] = useState(true);

  const { mutateAsync: updateAsset, isPending } = useUpdateAsset();
  const { mutateAsync: createTransaction } = useCreateTransaction();

  const isValid = capital.trim().length > 0 && maturity.trim().length > 0;

  // Al renovar, lo único que toca la cuenta es la diferencia de capital:
  //   capital nuevo > anterior → pusiste más plata (sale de la cuenta)
  //   capital nuevo < anterior → retiraste una parte (vuelve a la cuenta)
  const previousCapital = toNumber(asset.capital);
  const capitalDelta = (Number(capital) || 0) - previousCapital;
  const movementAmount = Math.abs(capitalDelta);
  const hasMovement = movementAmount > 0.009;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    try {
      setSubmitError(null);
      await updateAsset({
        id: asset.id,
        data: {
          capital: Number(capital),
          interest: interest ? Number(interest) : undefined,
          start_date: `${startDate}T00:00:00.000Z`,
          maturity: `${maturity}T00:00:00.000Z`,
          // TODO: permitir seleccionar origin_account_id distinto al account_id al renovar
          origin_account_id: asset.account_id,
        },
      });

      if (hasMovement && registerMovement) {
        await createTransaction({
          account_id: asset.account_id,
          type_id:
            capitalDelta > 0
              ? TRANSACTION_TYPE_IDS.INVERSION_SALIDA
              : TRANSACTION_TYPE_IDS.INVERSION_ENTRADA,
          amount: movementAmount,
          date: `${startDate}T00:00:00.000Z`,
          concept: asset.name,
        });
      }

      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No pudimos renovar el plazo fijo.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Renovar plazo fijo">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {submitError && (
          <div className="rounded-lg border border-[var(--color-expense-bg)] bg-[var(--color-expense-bg)] px-3 py-2 text-sm text-[var(--color-expense-text)]">
            {submitError}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
            Fecha de inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
            Vencimiento
          </label>
          <input
            type="date"
            value={maturity}
            min={startDate}
            onChange={(e) => setMaturity(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
            Capital
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
            Interés / TNA
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
          />
        </div>

        {hasMovement && (
          <label className="flex items-start gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)]">
            <input
              type="checkbox"
              checked={registerMovement}
              onChange={(e) => setRegisterMovement(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              {capitalDelta > 0 ? "Descontar de la cuenta" : "Acreditar en la cuenta"}
              <span className="block text-xs text-[var(--color-muted)]">
                El capital cambió en{" "}
                {new Intl.NumberFormat("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(movementAmount)}
                : se registra como{" "}
                {capitalDelta > 0 ? "“A inversión”" : "“De inversión”"}.
              </span>
            </span>
          </label>
        )}

        <Button type="submit" fullWidth disabled={!isValid || isPending}>
          {isPending ? "Renovando..." : "Confirmar renovación"}
        </Button>
      </form>
    </Modal>
  );
}
