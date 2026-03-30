import { JSX } from "react";

type AssetSummaryProps = {
  readonly totalValueLabel: string;
  readonly totalAssets: number;
  readonly assetsWithMaturity: number;
};

type SummaryCardProps = {
  readonly label: string;
  readonly value: string | number;
};

function SummaryCard({ label, value }: SummaryCardProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function AssetSummary({
  totalValueLabel,
  totalAssets,
  assetsWithMaturity,
}: AssetSummaryProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryCard label="Valor total" value={totalValueLabel} />
      <SummaryCard label="Activos" value={totalAssets} />
      <SummaryCard label="Próximos 7 días" value={assetsWithMaturity} />
    </div>
  );
}