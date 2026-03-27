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

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getAssetValue(asset: Asset): string | null {
  const quantity = toNumber(asset.quantity);
  const price = toNumber(asset.price);
  const capital = toNumber(asset.capital);

  if (quantity > 0 && price > 0) {
    return formatCurrency(quantity * price);
  }

  if (capital > 0) {
    return formatCurrency(capital);
  }

  return null;
}

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
  const assetValue = getAssetValue(asset);
  const formattedQuantity = getFormattedQuantity(asset);
  const visual = getAssetVisualConfig(asset.asset_type);
  const { Icon } = visual;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
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
                  <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                    {asset.symbol}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                  {visual.label}
                </span>
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