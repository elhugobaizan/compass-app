import { JSX } from "react";
import type { Asset } from "@/types/asset";
import { getDaysFromToday } from "@/utils/date";
import { toNumber } from "@/utils/numbers";
import { getAssetTypeConfig } from "@/utils/assetTypes";
import { useAssetCard } from "@/hooks/useAssetCard";
import Badge from "@/components/ui/Badge";

type AssetCardProps = {
  readonly asset: Asset;
  readonly accountName?: string;
};

type MaturityLabel = {
  text: string;
  tone: "warning" | "error" | "subtle";
};

function getMaturityLabel(dateString?: string | null): MaturityLabel | null {
  const days = getDaysFromToday(dateString);

  if (days === null) return null;
  if (days === 0) return { text: "Vence hoy", tone: "warning" };
  if (days === 1) return { text: "Vence mañana", tone: "subtle" };
  if (days > 1) return { text: `Vence en ${days} días`, tone: "subtle" };
  if (days === -1) return { text: "Venció ayer", tone: "error" };
  return { text: `Venció hace ${Math.abs(days)} días`, tone: "error" };
}

function getFormattedQuantity(asset: Asset): string | null {
  const quantity = toNumber(asset.quantity);

  if (quantity <= 0) return null;

  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 8,
  }).format(quantity);
}

export default function AssetCard({
  asset,
  accountName,
}: AssetCardProps): JSX.Element {
  const { formattedValue, formattedProjectedValue, formattedInterest } = useAssetCard(asset);
  const formattedQuantity = getFormattedQuantity(asset);
  const visual = getAssetTypeConfig(asset.asset_type);
  const { Icon } = visual;
  const maturityLabel = getMaturityLabel(asset.maturity);

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${visual.containerClassName}`}
          aria-hidden="true"
        >
          <Icon className={`h-4.5 w-4.5 ${visual.iconClassName}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                  {asset.name}
                </p>

                {asset.symbol && (
                  <Badge tone="subtle" className="px-1.5 text-[10px] font-semibold uppercase tracking-wide">
                    {asset.symbol}
                  </Badge>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge>{visual.label}</Badge>

                {maturityLabel && (
                  <Badge tone={maturityLabel.tone}>
                    {maturityLabel.text}
                  </Badge>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted)]">
                {accountName && <span className="truncate">{accountName}</span>}

                {accountName && formattedQuantity && (
                  <span className="text-[var(--color-border)]">•</span>
                )}

                {formattedQuantity && <span>Cant: {formattedQuantity}</span>}
              </div>
            </div>

            <div className="shrink-0 text-right">
              {formattedValue ? (
                <>
                  <p className="font-serif text-sm font-bold text-[var(--color-ink)]">{formattedValue}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">Capital</p>

                  {formattedInterest && (
                    <p className="mt-1 text-[11px] font-medium text-[var(--color-accent)]">{formattedInterest}</p>
                  )}

                  {formattedProjectedValue && (
                    <>
                      <p className="mt-1 font-serif text-sm font-semibold text-[var(--color-income)]">{formattedProjectedValue}</p>
                      <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">Al vencimiento</p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-[var(--color-muted)]">—</p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">Sin valuación</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}