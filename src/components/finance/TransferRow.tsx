import { JSX } from "react";
import { ArrowRightLeft, Pencil, Trash2 } from "lucide-react";
import type { TransactionListItem } from "@/types/transactionList";
import { formatCurrency, formatDate } from "@/utils/formatters";
import Button from "../ui/Button";

type TransferItem = Extract<TransactionListItem, { kind: "transfer" }>;

type TransferRowProps = {
  readonly item: TransferItem;
  readonly onEdit?: (item: TransferItem) => void;
  readonly onDelete?: (item: TransferItem) => void;
};

export default function TransferRow({
  item,
  onEdit,
  onDelete,
}: TransferRowProps): JSX.Element {
  const {
    amount,
    date,
    concept,
    originTransaction,
    destinationTransaction,
  } = item;

  const originAccountName =
    originTransaction.account?.name ?? "Cuenta origen";
  const destinationAccountName =
    destinationTransaction.account?.name ?? "Cuenta destino";

  const subtitle = `${originAccountName} → ${destinationAccountName}`;

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <ArrowRightLeft className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-gray-900">
                {concept?.trim() || "Transferencia"}
              </p>
            </div>

            <p className="truncate text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400">{formatDate(date)}</p>
      </div>

      <div className="flex shrink-0 items-start gap-2">
        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-medium uppercase text-blue-700">
          Transferencia
        </span>

        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            ↔ {formatCurrency(amount)}
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                aria-label="Editar transferencia"
              >
                <Pencil className="mr-1 h-3.5 w-3.5" />
              </Button>
            )}

            {onDelete && (
              <Button
                variant="danger-ghost"
                onClick={() => onDelete(item)}
                aria-label="Eliminar transferencia"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}