import { JSX } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { Asset } from "@/types/asset";
import Button from "@/components/ui/Button";
import AssetCard from "./AssetCard";

type AssetListItemProps = {
  readonly asset: Asset;
  readonly isMobile: boolean;
  readonly accountName?: string;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
  readonly id?: string;
  readonly isHighlighted?: boolean;
};

export function AssetListItem({
  asset,
  isMobile,
  accountName,
  onEdit,
  onDelete,
  id,
  isHighlighted = false,
}: AssetListItemProps): JSX.Element {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div id={id} className={["scroll-mt-24 overflow-hidden rounded-xl transition-shadow border border-gray-200 bg-white", 
      isHighlighted ? "ring-2 ring-amber-200 shadow-sm" : ""].join(" ")}>
      <AssetCard asset={asset} accountName={accountName} />

      {hasActions && !isMobile && (
        <div className="flex items-center justify-end gap-2 border border-t border-gray-100 bg-gray-50/80 px-4 py-3">
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
              aria-label="Editar activo"
            >
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Editar
            </Button>
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