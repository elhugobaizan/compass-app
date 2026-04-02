import { JSX } from "react";

import Badge from "@/components/ui/Badge";
import { formatRelativeDate } from "@/utils/formatters";

import {
  formatTransactionAmount,
  getTransactionAmountClass,
  getTransactionDisplayLabel,
  getTransactionIcon,
  getTransactionIconContainerClass,
  getTransactionTone,
} from "./transactionRow.utils";

type TransactionCardProps = {
  readonly concept?: string | null;
  readonly amount: string | number;
  readonly date: string;
  readonly typeLabel?: string;
  readonly categoryLabel?: string;
  readonly location?: string | null;
};

export default function TransactionCard({
  concept,
  amount,
  date,
  typeLabel,
  categoryLabel,
  location,
}: TransactionCardProps): JSX.Element {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getTransactionIconContainerClass(typeLabel)}`}
        >
          {getTransactionIcon(typeLabel)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {concept?.trim() || "Sin concepto"}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{formatRelativeDate(date)}</span>

                {categoryLabel && <Badge>{categoryLabel}</Badge>}

                {location && (
                  <span className="truncate text-gray-400">{location}</span>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p
                className={`text-sm font-bold ${getTransactionAmountClass(typeLabel)}`}
              >
                {formatTransactionAmount(amount, typeLabel)}
              </p>

              {typeLabel && (
                <div className="mt-1 flex justify-end">
                  <Badge tone={getTransactionTone(typeLabel)}>
                    {getTransactionDisplayLabel(typeLabel)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}