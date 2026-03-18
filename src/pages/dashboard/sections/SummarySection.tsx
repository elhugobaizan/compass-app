import { JSX } from "react";
import SectionBlock from "@/components/ui/SectionBlock";
import KPICard from "@/components/finance/KPICard";
import { formatCurrency } from "@/utils/formatters";

type SummarySectionProps = {
  readonly isMobile: boolean;
  readonly isLoading: boolean;
  readonly hasFinancialData: boolean;
  readonly hasAccounts: boolean;
  readonly hasTransactions: boolean;
  readonly summary: {
    netWorth: number;
    liquidity: number;
    debt: number;
    investments: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    trends: {
      netWorth?: {
        value: string;
        direction: "up" | "down" | "neutral";
      };
      income?: {
        value: string;
        direction: "up" | "down" | "neutral";
      };
      expenses?: {
        value: string;
        direction: "up" | "down" | "neutral";
      };
    };
  };
};

export default function SummarySection({
  isMobile,
  isLoading,
  hasFinancialData,
  hasAccounts,
  hasTransactions,
  summary,
}: SummarySectionProps): JSX.Element {
  const netWorthValue = hasAccounts ? formatCurrency(summary.netWorth) : null;
  const liquidityValue = hasAccounts ? formatCurrency(summary.liquidity) : null;
  const expensesValue = hasTransactions
    ? formatCurrency(summary.monthlyExpenses)
    : null;
  const incomeValue = hasTransactions
    ? formatCurrency(summary.monthlyIncome)
    : null;

  return (
    <SectionBlock
      title="Resumen"
      subtitle={isMobile ? undefined : "Vista general de tu situación financiera"}
    >
      {!hasFinancialData && !isLoading && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Todavía no hay datos suficientes para calcular el resumen.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
        <KPICard
          label="Patrimonio Neto"
          value={netWorthValue}
          isLoading={isLoading}
          size="featured"
          tone="neutral"
          trend={summary.trends.netWorth}
        />

        <KPICard
          label="Liquidez"
          value={liquidityValue}
          isLoading={isLoading}
          tone="positive"
        />

        <KPICard
          label="Gastos del mes"
          value={expensesValue}
          isLoading={isLoading}
          tone="negative"
          trend={summary.trends.expenses}
        />

        <KPICard
          label="Ingresos del mes"
          value={incomeValue}
          isLoading={isLoading}
          tone="positive"
          trend={summary.trends.income}
        />
      </div>
    </SectionBlock>
  );
}