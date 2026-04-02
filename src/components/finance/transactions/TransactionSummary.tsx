import SummaryCard from "@/components/ui/SummaryCard";
import { JSX } from "react";

type TransactionSummaryProps = {
  readonly totalTransactions: number;
  readonly totalIncomes: string | number;
  readonly totalExpenses: string | number;
  readonly totalIncomesCount?: number;
  readonly totalExpensesCount?: number;
};

export default function TransactionSummary({
  totalTransactions,
  totalIncomes,
  totalExpenses,
  totalIncomesCount,
  totalExpensesCount
}: TransactionSummaryProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <SummaryCard label="Total de transacciones" value={totalTransactions} />
      <SummaryCard label="Ingresos" value={totalIncomes} helperText={totalIncomesCount !== undefined ? `${totalIncomesCount} transacciones` : undefined} />
      <SummaryCard label="Gastos" value={totalExpenses} helperText={totalExpensesCount !== undefined ? `${totalExpensesCount} transacciones` : undefined} />
    </div>
  );
}