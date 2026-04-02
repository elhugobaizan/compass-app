import { JSX } from "react";
import {
  Bitcoin,
  Landmark,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { Asset } from "@/types/asset";
import { formatCurrency } from "@/utils/formatters";
import { getDaysFromToday } from "@/utils/date";
import { toNumber } from "@/utils/numbers";
import { getAssetValue } from "@/utils/assets";
import Badge from "@/components/ui/Badge";

type AssetCardProps = {
  readonly asset: Asset;
  readonly accountName?: string;
};

type AssetVisualConfig = {
  readonly label: string;
  readonly Icon: LucideIcon;
  readonly containerClassName: string;
  readonly iconClassName: string;
};

function getAssetVisualConfig(assetType: string): AssetVisualConfig {
  switch (assetType) {
    case "CRYPTO":
      return {
        label: "Cripto",
        Icon: Bitcoin,
        containerClassName: "bg-amber-50 border border-amber-100",
        iconClassName: "text-amber-600",
      };

    case "FIXED_DEPOSIT":
      return {
        label: "Plazo fijo",
        Icon: Landmark,
        containerClassName: "bg-sky-50 border border-sky-100",
        iconClassName: "text-sky-700",
      };

    case "INVESTMENT":
      return {
        label: "Inversión",
        Icon: TrendingUp,
        containerClassName: "bg-violet-50 border border-violet-100",
        iconClassName: "text-violet-700",
      };

    default:
      return {
        label: assetType,
        Icon: Wallet,
        containerClassName: "bg-gray-50 border border-gray-100",
        iconClassName: "text-gray-600",
      };
  }
}

function getMaturityLabel(dateString?: string | null): string | null {
  const days = getDaysFromToday(dateString);

  if (days === null) return null;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence mañana";
  if (days > 1) return `Vence en ${days} días`;

  return null;
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
  const assetValue = formatCurrency(getAssetValue(asset));
  const formattedQuantity = getFormattedQuantity(asset);
  const visual = getAssetVisualConfig(asset.asset_type);
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
                <p className="truncate text-sm font-semibold text-gray-900">
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
                  <Badge tone={maturityLabel === "Vence hoy" ? "warning" : "subtle"}>
                    {maturityLabel}
                  </Badge>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                {accountName && <span className="truncate">{accountName}</span>}

                {accountName && formattedQuantity && (
                  <span className="text-gray-300">•</span>
                )}

                {formattedQuantity && <span>Cant: {formattedQuantity}</span>}
              </div>
            </div>

            <div className="shrink-0 text-right">
              {assetValue ? (
                <>
                  <p className="text-sm font-bold text-gray-900">{assetValue}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Valor actual
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-400">—</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Sin valuación
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}