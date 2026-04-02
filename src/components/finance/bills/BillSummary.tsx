import SummaryCard from "@/components/ui/SummaryCard";
import { JSX } from "react";

type BillSummaryProps = {
  readonly totalValueLabel: string;
  readonly totalAssets: number;
  readonly assetsWithMaturity: number;
};

export default function BillSummary({
  totalValueLabel,
  totalAssets,
  assetsWithMaturity,
}: BillSummaryProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryCard label="Total estimado" value={totalValueLabel} helperText={`n impuestos`} />
      <SummaryCard label="Pagado" value={totalAssets} helperText={`n registrados`} />
      <SummaryCard label="Pendiente" value={assetsWithMaturity} helperText={`n por pagar`} />
    </div>
  );
}