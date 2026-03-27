import { JSX } from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { Asset } from "@/types/asset";
import Button from "@/components/ui/Button";
import AssetCard from "./AssetCard";

type AssetListItemProps = {
  readonly asset: Asset;
  readonly accountName?: string;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
};

export function AssetListItem({
  asset,
  accountName,
  onEdit,
  onDelete,
}: AssetListItemProps): JSX.Element {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-hidden rounded-2xl">
      <AssetCard asset={asset} accountName={accountName} />

      {hasActions && (
        <div className="flex items-center justify-end gap-2 border border-t-0 border-gray-100 bg-gray-50/70 px-4 py-3">
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