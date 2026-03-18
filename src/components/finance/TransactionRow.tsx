import { JSX } from "react";
import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight } from "lucide-react";
import { formatRelativeDate } from "@/utils/formatters";

type TransactionRowProps = {
  concept?: string | null;
  amount: string | number;
  date: string;
  typeLabel?: string;
  categoryLabel?: string;
  location?: string | null;
};

function getAmountClass(typeLabel?: string): string {
  if (typeLabel === "INGRESO") return "text-green-600";
  if (typeLabel === "TRANSFERENCIA_ENTRADA" || typeLabel === "TRANSFERENCIA_SALIDA") return "text-blue-600";
  if (typeLabel === "GASTO") return "text-gray-900";
  return "text-gray-900";
}

function getTypeBadgeClass(typeLabel?: string): string {
  if (typeLabel === "INGRESO") {
    return "bg-green-50 text-green-700 border border-green-200";
  }

  if (typeLabel === "TRANSFERENCIA_ENTRADA" || typeLabel === "TRANSFERENCIA_SALIDA") {
    return "bg-blue-50 text-blue-700 border border-blue-200";
  }

  if (typeLabel === "GASTO") {
    return "bg-gray-100 text-gray-700 border border-gray-200";
  }

  return "bg-gray-100 text-gray-600 border border-gray-200";
}

function getAmountPrefix(typeLabel?: string): string {
  if (typeLabel === "INGRESO") return "+";
  if (typeLabel === "GASTO") return "-";
  if (typeLabel === "TRANSFERENCIA_ENTRADA" || typeLabel === "TRANSFERENCIA_SALIDA") return "↔";
  return "";
}

function formatDisplayAmount(
  amount: string | number,
  typeLabel?: string
): string {
  const prefix = getAmountPrefix(typeLabel);
  return `${prefix} ${amount}`;
}

function getTypeIcon(typeLabel?: string): JSX.Element {
  if (typeLabel === "INCOME") {
    return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
  }

  if (typeLabel === "TRANSFER") {
    return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
  }

  return <ArrowUpRight className="h-4 w-4 text-gray-700" />;
}

export default function TransactionRow({
  concept,
  amount,
  date,
  typeLabel,
  categoryLabel,
  location,
}: TransactionRowProps): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {getTypeIcon(typeLabel)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {concept || "Sin concepto"}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{formatRelativeDate(date)}</span>

                {categoryLabel && (
                  <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-600">
                    {categoryLabel}
                  </span>
                )}

                {location && <span>{location}</span>}
              </div>
            </div>

            {typeLabel && (
              <span
                className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${getTypeBadgeClass(
                  typeLabel
                )}`}
              >
                {typeLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className={`text-sm font-bold ${getAmountClass(typeLabel)}`}>
          {formatDisplayAmount(amount, typeLabel)}
        </p>
      </div>
    </div>
  );
}