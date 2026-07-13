import { JSX } from "react";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";

import type { Asset } from "@/types/asset";
import Button from "@/components/ui/Button";
import AssetCard from "./AssetCard";

type AssetListItemProps = {
  readonly asset: Asset;
  readonly isMobile: boolean;
  readonly accountName?: string;
  readonly accountLogo?: string | null;
  readonly onEdit?: () => void;
  readonly onRenew?: () => void;
  readonly onDelete?: () => void;
  readonly id?: string;
  readonly isHighlighted?: boolean;
};

export function AssetListItem({
  asset,
  isMobile,
  accountName,
  accountLogo,
  onEdit,
  onRenew,
  onDelete,
  id,
  isHighlighted = false,
}: AssetListItemProps): JSX.Element {
  const isFixedDeposit = asset.asset_type === "FIXED_DEPOSIT";
  const hasActions = Boolean(onEdit || onRenew || onDelete);

  return (
    <div id={id} className={["flex h-full flex-col scroll-mt-24 overflow-hidden rounded-xl transition-shadow border border-[var(--color-border)] bg-[var(--color-card)]",
      isHighlighted ? "ring-2 ring-[var(--color-accent)] shadow-sm" : ""].join(" ")}>
      <div className="flex-1">
        <AssetCard asset={asset} accountName={accountName} logo={accountLogo} />
      </div>

      {hasActions && !isMobile && (
        <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] bg-[var(--color-paper)] px-4 py-3">
          {isFixedDeposit ? (
            onRenew && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onRenew}
                aria-label="Renovar plazo fijo"
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                Renovar
              </Button>
            )
          ) : (
            onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onEdit}
                aria-label="Editar activo"
              >
                <Pencil className="mr-1 h-3.5 w-3.5" />
                Editar
              </Button>
            )
          )}

          {onDelete && (
            <Button
              variant="danger-ghost"
              size="sm"
              onClick={onDelete}
              aria-label="Eliminar activo"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}