import { JSX } from "react";
import SectionBlock from "@/components/ui/SectionBlock";
import PanelCard from "@/components/ui/PanelCard";
import EmptyState from "@/components/ui/EmptyState";
import TransactionRow from "@/components/finance/TransactionRow";
import type { Transaction } from "@/types/transaction";
import { getRecentTransactions } from "@/utils/transactions";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useExpenseBreakdown } from "@/hooks/useExpenseBreakdown";
import { useMonthlyIncomeExpense } from "@/hooks/useMonthlyIncomeExpense";
import CategoryBreakdownChart from "@/components/finance/CategoryBreakdownChart";
import IncomeExpenseChart from "@/components/finance/IncomeExpenseChart";
import { useNetWorthHistory } from "@/hooks/useNetWorthHistory";
import NetWorthHistoryChart from "@/components/finance/NetWorthHistoryChart";
import { Snapshot } from "@/services/snapshots";

type ActivitySectionProps = {
  readonly isMobile: boolean;
  readonly transactions?: Transaction[];
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly snapshots?: Snapshot[];
  readonly isLoadingSnapshots: boolean;
  readonly isErrorSnapshots: boolean;
};

export default function ActivitySection({
  isMobile,
  transactions,
  isLoading,
  isError,
  snapshots,
  isLoadingSnapshots,
  isErrorSnapshots
}: ActivitySectionProps): JSX.Element {
  const recentTransactions = getRecentTransactions(transactions || [], 3);
  const hasTransactions = !!recentTransactions?.length;
  const navigate = useNavigate();
  const expenseBreakdown = useExpenseBreakdown(transactions);
  const topExpenseBreakdown = expenseBreakdown.slice(0, 5);
  const monthlyData = useMonthlyIncomeExpense(transactions);
  const netWorthHistory = useNetWorthHistory(snapshots);

  return (
    <SectionBlock
      title="Actividad"
      subtitle={isMobile ? undefined : "Gráficos y movimientos recientes"}
    >
      <div className={isMobile ? "space-y-4" : "grid grid-cols-3 gap-6"}>
        <PanelCard
          title="Evolución del patrimonio"
          subtitle="Últimos meses"
          className="h-64"
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

        {!isMobile && (<PanelCard
          title="Ingresos vs  Gastos"
          subtitle="Ultimos meses"
          className="h-64"
        >
          {isLoading && (
            <p className="text-sm text-gray-500">Cargando gráfico...</p>
          )}
          {isError && (
            <EmptyState 
              title=""
              description=""
              variant="error"
            />
          )}
          {!isLoading && !isError && monthlyData.length === 0 && (
            <EmptyState 
              title=""
              description=""
            />
          )}
          {!isLoading && !isError && monthlyData.length > 0 && (
            <IncomeExpenseChart items={monthlyData} />
          )}
        </PanelCard>)}

{/*         {!isMobile && (<PanelCard
          title="Gastos por categoría"
          subtitle="Mes actual"
          className="h-64"
        >
          {isLoading && (
            <p className="text-sm text-gray-500">Cargando breakdown...</p>
          )}

          {isError && (
            <EmptyState
              title="No pudimos calcular el breakdown"
              description="Revisá la conexión o el backend e intentá de nuevo."
              variant="error"
            />
          )}

          {!isLoading && !isError && topExpenseBreakdown.length === 0 && (
            <EmptyState 
              title="Todavía no hay gastos categorizados"
              description="Cuando registres gastos, vas a ver el breakdown acá."
            />
          )}

          {!isLoading && !isError && topExpenseBreakdown.length > 0 && (
            <div className="h-full overflow-y-auto pr-1">
              <CategoryBreakdownChart items={topExpenseBreakdown} />
            </div>
          )}
        </PanelCard>)} */}

        <PanelCard
          title="Últimos movimientos"
          subtitle="Timeline resumido"
          className="h-64"
          action={
            hasTransactions ? (
              <Button variant="ghost" className={"px-2 py-1 text-xs"}
                onClick={() => navigate("/transactions")}
              >
                Ver todos
              </Button>
            ) : null
          }
        >
          {isLoading && <p className="text-sm text-gray-500">Cargando movimientos...</p>}

          {isError && (
            <EmptyState
              title="No pudimos cargar los movimientos"
              description="Revisá el backend o la conexión e intentá de nuevo."
              variant="error"
            />
          )}

          {!isLoading && !isError && recentTransactions?.length === 0 && (
            <EmptyState
              title="Todavía no hay movimientos"
              description="Cuando registres tus primeras transacciones, vas a ver el resumen acá."
            />
          )}

          {!isLoading && !isError && !!recentTransactions?.length && (
            <div className="h-full space-y-3 overflow-y-auto pr-1">
              {recentTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  amount={transaction.amount}
                  date={transaction.date}
                  concept={transaction.concept}
                  typeLabel={transaction.type.name || "unknown"}
                  categoryLabel={transaction.category?.name || "Sin categoría"}
                />
              ))}
            </div>
          )}
        </PanelCard>
      </div>
    </SectionBlock>
  );
}