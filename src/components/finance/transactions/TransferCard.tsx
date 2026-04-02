import { JSX } from "react";
import { ArrowRightLeft } from "lucide-react";

import type { TransactionListItem } from "@/types/transactionList";
import { formatCurrency, formatRelativeDate } from "@/utils/formatters";

import Badge from "@/components/ui/Badge";

type TransferItem = Extract<TransactionListItem, { kind: "transfer" }>;

type TransferCardProps = {
  readonly item: TransferItem;
};

export default function TransferCard({
  item,
}: TransferCardProps): JSX.Element {
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

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
          <ArrowRightLeft className="h-4 w-4 text-blue-600" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {concept?.trim() || "Transferencia"}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{formatRelativeDate(date)}</span>
                <span className="truncate text-gray-400">
                  {originAccountName} → {destinationAccountName}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-blue-600">
                ↔ {formatCurrency(amount)}
              </p>

              <div className="mt-1 flex justify-end">
                <Badge tone="info">Transferencia</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}