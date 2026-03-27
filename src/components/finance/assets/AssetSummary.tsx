import { JSX } from "react";

type AssetSummaryProps = {
  readonly totalValue: string;
  readonly totalCount: number;
};

export default function AssetSummary({
  totalValue,
  totalCount,
}: AssetSummaryProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
        <p className="text-xs font-medium text-gray-500">Valor total</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{totalValue}</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
        <p className="text-xs font-medium text-gray-500">Activos</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{totalCount}</p>
      </div>
    </div>
  );
}