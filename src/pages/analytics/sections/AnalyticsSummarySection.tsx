import KPICard from "@/components/finance/KPICard";
import SectionBlock from "@/components/ui/SectionBlock";
import { AnalyticsKPIs } from "@/utils/analyticsKPIs";
import { formatCurrency } from "@/utils/formatters";
import { JSX } from "react";

type AnalyticsSummaryProps = {
  readonly isMobile: boolean;
  readonly isLoading: boolean;
  readonly hasFinancialData: boolean;
  readonly hasAccounts: boolean;
  readonly hasTransactions: boolean;
  readonly summary: AnalyticsKPIs;
};

export default function AnalyticsSummarySection({
  isMobile,
  isLoading,
  hasFinancialData,
  hasAccounts,
  hasTransactions,
  summary
}: AnalyticsSummaryProps): JSX.Element {
  return (
    <SectionBlock
      title="Resumen ampliado"
      subtitle={isMobile ? undefined : "Métricas clave del período actual"}
    >
      {!hasFinancialData && !isLoading && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Todavía no hay datos suficientes para mostrar analítica
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KPICard
          label="Patrimonio neto"
          value={hasAccounts ? formatCurrency(summary.netWorth) : null}
          isLoading={isLoading}
          tone="neutral"
          trend={summary.trends.netWorth}
        />
        <KPICard
          label="Liquidez"
          value={hasAccounts ? formatCurrency(summary.liquidity) : null}
          isLoading={isLoading}
          tone="positive"
        />
        <KPICard
          label="Inversiones"
          value={hasAccounts ? formatCurrency(summary.investments) : null}
          isLoading={isLoading}
          tone="info"
        />
        <KPICard
          label="Deuda"
          value={hasAccounts ? formatCurrency(summary.debt) : null}
          isLoading={isLoading}
          tone="negative"
        />
        <KPICard
          label="Ingresos del periodo"
          value={hasTransactions ? formatCurrency(summary.periodIncome) : null}
          subvalue={`Promedio mensual: ${formatCurrency(summary.averageMonthlyIncome)}`}
          isLoading={isLoading}
          tone="positive"
          trend={summary.trends.income}
        />
        <KPICard
          label="Gastos del periodo"
          value={hasTransactions ? formatCurrency(summary.periodExpenses) : null}
          subvalue={`Promedio mensual: ${formatCurrency(summary.averageMonthlyExpenses)}`}
          isLoading={isLoading}
          tone="negative"
          trend={summary.trends.expenses}
        />
        <KPICard
          label="Ahorro del periodo"
          value={hasTransactions ? formatCurrency(summary.periodSavings) : null}
          subvalue={`Promedio mensual: ${formatCurrency(summary.averageMonthlySavings)}`}
          isLoading={isLoading}
          tone={summary.periodSavings >= 0 ? "positive" : "negative"}
          trend={summary.trends.savings}
        />
      </div>
    </SectionBlock>
  );
}