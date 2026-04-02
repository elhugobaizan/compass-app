import SummaryCard from "@/components/ui/SummaryCard";
import { JSX } from "react";

type AssetSummaryProps = {
  readonly totalValueLabel: string;
  readonly totalAssets: number;
  readonly assetsWithMaturity: number;
};

export default function AssetSummary({
  totalValueLabel,
  totalAssets,
  assetsWithMaturity,
}: AssetSummaryProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryCard label="Valor total" value={totalValueLabel} />
      <SummaryCard label="Activos" value={totalAssets} helperText="Posiciones cargadas" />
      <SummaryCard label="Próximos 7 días" value={assetsWithMaturity} helperText="Vencimientos cercanos" />
    </div>
  );
}