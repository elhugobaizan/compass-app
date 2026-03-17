import { JSX

 } from "react";
type TransactionRowProps = {
  readonly concept?: string | null;
  readonly amount: string | number;
  readonly date: string;
  readonly typeLabel?: string;
  readonly categoryLabel?: string;
  readonly location?: string | null;
};

function getAmountClass(typeLabel?: string): string {
  if (typeLabel === "INCOME") return "text-green-600";
  if (typeLabel === "EXPENSE") return "text-gray-900";
  if (typeLabel === "TRANSFER") return "text-blue-600";
  return "text-gray-900";
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
    <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {concept || "Sin concepto"}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span>{date}</span>
          {typeLabel && <span>{typeLabel}</span>}
          {categoryLabel && <span>{categoryLabel}</span>}
          {location && <span>{location}</span>}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className={`text-sm font-semibold ${getAmountClass(typeLabel)}"`}>{amount}</p>
      </div>
    </div>
  );
}