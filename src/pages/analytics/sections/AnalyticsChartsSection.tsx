import { JSX } from "react";
import SectionBlock from "@/components/ui/SectionBlock";
import PanelCard from "@/components/ui/PanelCard";
import EmptyState from "@/components/ui/EmptyState";

import NetWorthHistoryChart from "@/components/finance/NetWorthHistoryChart";
import IncomeExpenseChart from "@/components/finance/IncomeExpenseChart";
import CategoryBreakdownChart from "@/components/finance/CategoryBreakdownChart";

import type { Transaction } from "@/types/transaction";
import type { Snapshot } from "@/services/snapshots";

import { useNetWorthHistory } from "@/hooks/useNetWorthHistory";
import { useMonthlyIncomeExpense } from "@/hooks/useMonthlyIncomeExpense";
import { useExpenseBreakdown } from "@/hooks/useExpenseBreakdown";

type Props = {
  readonly isMobile: boolean;
  readonly transactions?: Transaction[];
  readonly snapshots?: Snapshot[];
  readonly isLoadingTransactions: boolean;
  readonly isLoadingSnapshots: boolean;
  readonly isErrorTransactions: boolean;
  readonly isErrorSnapshots: boolean;
};

export default function AnalyticsChartsSection({
  isMobile,
  transactions,
  snapshots,
  isLoadingTransactions,
  isLoadingSnapshots,
  isErrorTransactions,
  isErrorSnapshots,
}: Props): JSX.Element {
  const netWorthHistory = useNetWorthHistory(snapshots);
  const monthlyIncomeExpense = useMonthlyIncomeExpense(transactions);
  const expenseBreakdown = useExpenseBreakdown(transactions).slice(0, 6);

  return (
    <SectionBlock
      title="Gráficos"
      subtitle={isMobile ? undefined : "Evolución y composición"}
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PanelCard
          title="Evolución del patrimonio"
          subtitle="Últimos meses"
          className="h-72"
        >
          {isLoadingSnapshots && (
            <p className="text-sm text-gray-500">Cargando evolución...</p>
          )}

          {isErrorSnapshots && (
            <EmptyState
              title="No pudimos cargar la evolución"
              description="Revisá la conexión o el backend."
              variant="error"
            />
          )}

          {!isLoadingSnapshots && !isErrorSnapshots && netWorthHistory.length === 0 && (
            <EmptyState
              title="Todavía no hay snapshots"
              description="Cuando tengas historial guardado, vas a ver la evolución acá."
            />
          )}

          {!isLoadingSnapshots && !isErrorSnapshots && netWorthHistory.length > 0 && (
            <NetWorthHistoryChart items={netWorthHistory} />
          )}
        </PanelCard>

        <PanelCard
          title="Ingresos vs gastos"
          subtitle="Últimos meses"
          className="h-72"
        >
          {isLoadingTransactions && (
            <p className="text-sm text-gray-500">Cargando gráfico...</p>
          )}

          {isErrorTransactions && (
            <EmptyState
              title="No pudimos calcular los datos"
              description="Revisá la conexión o el backend."
              variant="error"
            />
          )}

          {!isLoadingTransactions &&
            !isErrorTransactions &&
            monthlyIncomeExpense.length === 0 && (
              <EmptyState
                title="Sin datos"
                description="Cuando registres movimientos, aparecerá el gráfico."
              />
            )}

          {!isLoadingTransactions &&
            !isErrorTransactions &&
            monthlyIncomeExpense.length > 0 && (
              <IncomeExpenseChart items={monthlyIncomeExpense} />
            )}
        </PanelCard>

        <PanelCard
          title="Gastos por categoría"
          subtitle="Mes actual"
          className="h-72 xl:col-span-2"
        >
          {isLoadingTransactions && (
            <p className="text-sm text-gray-500">Cargando breakdown...</p>
          )}

          {isErrorTransactions && (
            <EmptyState
              title="No pudimos calcular el breakdown"
              description="Revisá la conexión o el backend."
              variant="error"
            />
          )}

          {!isLoadingTransactions &&
            !isErrorTransactions &&
            expenseBreakdown.length === 0 && (
              <EmptyState
                title="Todavía no hay gastos categorizados"
                description="Cuando registres gastos, vas a ver el breakdown acá."
              />
            )}

          {!isLoadingTransactions &&
            !isErrorTransactions &&
            expenseBreakdown.length > 0 && (
              <CategoryBreakdownChart items={expenseBreakdown} />
            )}
        </PanelCard>
      </div>
    </SectionBlock>
  );
}