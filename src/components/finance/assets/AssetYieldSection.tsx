import { JSX, useMemo, useState } from "react";
import type { Asset } from "@/types/asset";
import type { Account } from "@/types/account";
import { useExchangeRates } from "@/hooks/queries/useExchangeRates";
import SectionBlock from "@/components/ui/SectionBlock";
import Button from "@/components/ui/Button";
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
  const [isExpanded, setIsExpanded] = useState(false);
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
          <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between"
            >
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Detalle por activo ({yields.length})
              </span>
              <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
            </Button>

            {isExpanded && (
              <div className="space-y-2 pt-2">
                {yields.map((y) => (
                  <div
                    key={y.asset.id}
                    className="flex items-center justify-between rounded-lg bg-[var(--color-paper)] px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[var(--color-ink)]">{y.asset.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">{y.tna.toFixed(2)}% TNA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--color-income-text)]">
                        {formatCurrency(y.dailyYield, y.currency)} / día
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {formatCurrency(y.monthlyYield, y.currency)} / mes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </SectionBlock>
  );
}
