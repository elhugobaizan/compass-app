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
  const netWorth = hasAccounts ? formatCurrency(summary.netWorth) : null;
  const liquidity = hasAccounts ? formatCurrency(summary.liquidity) : null;
  const monthlyIncome = hasTransactions ? formatCurrency(summary.monthlyIncome) : null;
  const monthlyExpenses = hasTransactions ? formatCurrency(summary.monthlyExpenses) : null;

  return (
    <SectionBlock
      title="Resumen"
      subtitle={isMobile ? undefined : "Vista general de tu situación financiera"}
    >
      {!hasFinancialData && !isLoading && (
        <p className="text-sm text-gray-500">
          Todavía no hay datos suficientes para calcular el resumen.
        </p>
      )}

      <div className={"grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6"}>
        <KPICard
          label="Patrimonio Neto"
          value={netWorth}
          isLoading={isLoading}
          size="featured"
          tone="neutral"
          trend={{ value: "+5% vs mes anterior", direction: "up", sentiment: "positive" }}
        />
        <KPICard
          label="Liquidez"
          value={liquidity}
          isLoading={isLoading}
          tone="positive"
        />
        {!isMobile && (
          <KPICard
            label="Ingresos Mensuales"
            value={monthlyIncome}
            isLoading={isLoading}
            tone="positive"
          />
        )}
        <KPICard
          label="Gastos Mensuales"
          value={monthlyExpenses}
          isLoading={isLoading}
          tone="negative"
          trend={{ value: "+8% vs mes anterior", direction: "up", sentiment: "negative" }}
        />
      </div>
    </SectionBlock>
  );
}