import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import type { ForeignAccountDetail } from "@/utils/analyticsKPIs";
import type { ExchangeRates } from "@/utils/currency";
import { BASE_CURRENCY } from "@/config/currencies";
import { formatCurrency } from "@/utils/formatters";

type ForeignCurrencyModalProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly accounts: ForeignAccountDetail[];
  readonly total: number;
  readonly rates?: ExchangeRates;
};

/**
 * Las cotizaciones se muestran con decimales: monedas de valor bajo (CLP ~1,64)
 * quedarían engañosas redondeadas a pesos enteros.
 */
function formatRate(rate: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: rate < 10 ? 4 : 2,
  }).format(rate);
}

export default function ForeignCurrencyModal({
  open,
  onClose,
  accounts,
  total,
  rates,
}: ForeignCurrencyModalProps): JSX.Element {
  // Solo las monedas que realmente aparecen en el detalle (excluye la base)
  const usedCurrencies = new Set(accounts.map((account) => account.currency));
  const usedRates = Object.entries(rates ?? {}).filter(
    ([code, rate]) => code !== BASE_CURRENCY && rate > 0 && usedCurrencies.has(code),
  );

  return (
    <Modal open={open} onClose={onClose} title="Divisas">
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-muted)]">
          Cuentas líquidas en moneda extranjera. Suman al patrimonio, pero no se
          cuentan como liquidez.
        </p>

        {accounts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-4 text-center text-sm text-[var(--color-muted)]">
            No hay cuentas en moneda extranjera.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                    {account.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {formatCurrency(account.nativeBalance, account.currency)}
                  </p>
                </div>
                <span className="shrink-0 font-serif text-sm font-semibold text-[var(--color-ink)]">
                  {formatCurrency(account.arsBalance)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
          <span className="text-sm font-medium text-[var(--color-ink)]">Total</span>
          <span className="font-serif text-base font-semibold text-[var(--color-ink)]">
            {formatCurrency(total)}
          </span>
        </div>

        {usedRates.length > 0 && (
          <p className="text-xs text-[var(--color-muted)]">
            Cotizaciones usadas:{" "}
            {usedRates
              .map(([code, rate]) => `${code} ${formatRate(rate)}`)
              .join(" · ")}{" "}
            — promedio compra/venta.
          </p>
        )}
      </div>
    </Modal>
  );
}
