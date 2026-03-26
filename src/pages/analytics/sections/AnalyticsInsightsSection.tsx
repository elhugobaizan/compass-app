import { JSX } from "react";
import SectionBlock from "@/components/ui/SectionBlock";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import type { Transaction } from "@/types/transaction";
import { TRANSACTION_TYPES } from "@/utils/transactionTypes";

type Summary = {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
};

type Props = {
  readonly isMobile: boolean;
  readonly transactions?: Transaction[];
  readonly summary: Summary;
  readonly isLoading: boolean;
  readonly isError: boolean;
};

function getTopExpenseCategory(transactions: Transaction[] = []): string | null {
  const now = new Date();

  const expenseTransactions = transactions.filter((tx) => {
    const date = new Date(tx.date);
    return (
      tx.type.name === TRANSACTION_TYPES.GASTO &&
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  });

  const totals = expenseTransactions.reduce<Record<string, number>>((acc, tx) => {
    const name = tx.category?.name ?? "Sin categoría";
    const amount = Number(tx.amount) || 0;
    acc[name] = (acc[name] ?? 0) + amount;
    return acc;
  }, {});

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? null;
}

export default function AnalyticsInsightsSection({
  isMobile,
  transactions,
  summary,
  isLoading,
  isError,
}: Props): JSX.Element {
  const topExpenseCategory = getTopExpenseCategory(transactions ?? []);

  return (
    <SectionBlock
      title="Insights"
      subtitle={isMobile ? undefined : "Lecturas rápidas del período"}
    >
      {isLoading && <p className="text-sm text-gray-500">Cargando insights...</p>}

      {isError && (
        <EmptyState
          title="No pudimos calcular los insights"
          description="Revisá la conexión o el backend."
          variant="error"
        />
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card>
            <p className="text-sm text-gray-500">Resultado del mes</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {summary.monthlySavings >= 0 ? "Mes positivo" : "Mes negativo"}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">Categoría más pesada</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {topExpenseCategory ?? "—"}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-500">Relación gasto / ingreso</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {summary.monthlyIncome > 0
                ? `${Math.round(
                    (summary.monthlyExpenses / summary.monthlyIncome) * 100
                  )}%`
                : "—"}
            </p>
          </Card>
        </div>
      )}
    </SectionBlock>
  );
}