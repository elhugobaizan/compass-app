import SummaryCard from "@/components/ui/SummaryCard";
import { JSX } from "react";

type AccountSummaryProps = {
  readonly totalBalanceLabel: string;
  readonly totalAccounts: number;
  readonly paymentMethods: number;
};

export default function AccountSummary({
  totalBalanceLabel,
  totalAccounts,
  paymentMethods,
}: AccountSummaryProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryCard label="Balance total" value={totalBalanceLabel} />
      <SummaryCard label="Cuentas" value={totalAccounts} helperText="Cuentas activas" />
      <SummaryCard label="Métodos de pago" value={paymentMethods} helperText="Marcadas como pago" />
    </div>
  );
}
