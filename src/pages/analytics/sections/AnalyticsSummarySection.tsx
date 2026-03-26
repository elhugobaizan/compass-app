import KPICard from "@/components/finance/KPICard";
import SectionBlock from "@/components/ui/SectionBlock";
import { formatCurrency } from "@/utils/formatters";
import { SummaryKPIs } from "@/utils/kpis";
import { JSX } from "react";

type AnalyticsSummaryProps = {
  readonly isMobile: boolean;
  readonly isLoading: boolean;
  readonly hasFinancialData: boolean;
  readonly hasAccounts: boolean;
  readonly hasTransactions: boolean;
  readonly summary: SummaryKPIs;
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
          label="Ingresos del mes"
          value={hasTransactions ? formatCurrency(summary.monthlyIncome) : null}
          isLoading={isLoading}
          tone="positive"
          trend={summary.trends.income}
        />
        <KPICard
          label="Gastos del mes"
          value={hasTransactions ? formatCurrency(summary.monthlyExpenses) : null}
          isLoading={isLoading}
          tone="negative"
          trend={summary.trends.expenses}
        />
        <KPICard
          label="Ahorro del mes"
          value={hasTransactions ? formatCurrency(summary.monthlySavings) : null}
          isLoading={isLoading}
          tone={summary.monthlySavings >= 0 ? "positive" : "negative"}
          trend={summary.trends.savings}
        />        
      </div>
    </SectionBlock>
  );
}