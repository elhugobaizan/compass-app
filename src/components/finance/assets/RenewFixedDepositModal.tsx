import { useState, JSX } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Asset } from "@/types/asset";
import { useUpdateAsset } from "@/hooks/mutations/useUpdateAsset";
import { addDays, toLocalDateString } from "@/utils/date";
import { toNumber } from "@/utils/numbers";

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

  const { mutateAsync: updateAsset, isPending } = useUpdateAsset();

  const isValid = capital.trim().length > 0 && maturity.trim().length > 0;

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
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No pudimos renovar el plazo fijo.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Renovar plazo fijo">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Fecha de inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Vencimiento
          </label>
          <input
            type="date"
            value={maturity}
            min={startDate}
            onChange={(e) => setMaturity(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Capital
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Interés / TNA
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>

        <Button type="submit" fullWidth disabled={!isValid || isPending}>
          {isPending ? "Renovando..." : "Confirmar renovación"}
        </Button>
      </form>
    </Modal>
  );
}
