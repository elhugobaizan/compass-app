import { JSX, useMemo } from "react";
import type { Asset } from "@/types/asset";
import type { Account } from "@/types/account";
import { useExchangeRates } from "@/hooks/queries/useExchangeRates";
import SectionBlock from "@/components/ui/SectionBlock";
import { calculateTotalYield } from "@/utils/assetYield";
import { formatCurrency } from "@/utils/formatters";

type AssetYieldSectionProps = {
  readonly assets: Asset[];
  readonly accounts?: Account[];
  readonly isMobile: boolean;
};

export default function AssetYieldSection({
  assets,
  accounts,
  isMobile,
}: AssetYieldSectionProps): JSX.Element | null {
  const rates = useExchangeRates();
  const ratesKey = JSON.stringify(rates);
  const { totalDaily, totalMonthly, yields } = useMemo(
    () => calculateTotalYield(assets, accounts ?? [], rates),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assets, accounts, ratesKey]
  );

  if (yields.length === 0) return null;

  return (
    <SectionBlock
      title="Rendimientos"
      subtitle={isMobile ? undefined : "Rendimiento diario y mensual de tus activos"}
    >
      <div className={isMobile ? "space-y-4" : "space-y-6"}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-4">
            <p className="text-sm text-[var(--color-muted)]">Rendimiento diario</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--color-income-text)]">
              {formatCurrency(totalDaily)}
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-4">
            <p className="text-sm text-[var(--color-muted)]">Rendimiento mensual</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--color-income-text)]">
              {formatCurrency(totalMonthly)}
            </p>
          </div>
        </div>

        {yields.length > 0 && (
          <p className="text-xs text-[var(--color-muted)]">
            {yields.length} {yields.length === 1 ? "activo genera" : "activos generan"}{" "}
            rendimiento · tocá una tarjeta para ver su detalle.
          </p>
        )}
      </div>
    </SectionBlock>
  );
}
