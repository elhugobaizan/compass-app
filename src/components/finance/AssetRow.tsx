import { JSX } from "react";
import type { Asset } from "@/types/asset";
import { formatCurrency } from "@/utils/formatters";
import Button from "../ui/Button";
import { Pencil, Trash2 } from "lucide-react";

type AssetRowProps = {
  readonly asset: Asset;
  readonly accountName?: string;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
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

function getAssetMeta(asset: Asset): string {
  if (asset.asset_type === "FIXED_DEPOSIT") return "Plazo fijo";
  if (asset.asset_type === "CRYPTO") return "Cripto";
  if (asset.asset_type === "STOCK") return "Acción / ETF";
  return asset.asset_type;
}

export default function AssetRow({
  asset,
  accountName,
  onEdit,
  onDelete,
}: AssetRowProps): JSX.Element {
  const assetValue = getAssetValue(asset);

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {asset.name}
          </p>

          {asset.symbol && (
            <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-600">
              {asset.symbol}
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>{getAssetMeta(asset)}</span>

          {accountName && (
            <>
              <span className="text-gray-300">•</span>
              <span>{accountName}</span>
            </>
          )}

          {asset.quantity && (
            <>
              <span className="text-gray-300">•</span>
              <span>Cant: {asset.quantity}</span>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        {assetValue ? (
          <p className="text-sm font-bold text-gray-900">{assetValue}</p>
        ) : (
          <p className="text-sm text-gray-400">—</p>
        )}
      </div>

      <div className="flex items-center gap-1">
        {onEdit && (
          <Button
            variant="ghost"
            onClick={onEdit}
            aria-label="Editar movimiento"
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="danger-ghost"
            onClick={onDelete}
            aria-label="Eliminar activo"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
          </Button>
        )}

      </div>
    </div>
  );
}