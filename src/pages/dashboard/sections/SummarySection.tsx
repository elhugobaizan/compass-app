import { JSX } from "react";
import SectionBlock from "@/components/ui/SectionBlock";
import KPICard from "@/components/finance/KPICard";
import { formatCurrency } from "@/utils/formatter";

type SummarySectionProps = {
  readonly isMobile: boolean;
  readonly isLoading: boolean;
  readonly hasFinancialData: boolean;
  readonly hasAccounts: boolean;
  readonly summary: {
    netWorth: number;
    liquidity: number;
    debt: number;
  };
};

export default function SummarySection({
  isMobile,
  isLoading,
  hasFinancialData,
  hasAccounts,
  summary,
}: SummarySectionProps): JSX.Element {
  
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

      <div className={isMobile ? "grid grid-cols-1 gap-4" : "grid grid-cols-3 gap-6"}>
        <KPICard
          label="Patrimonio Neto"
          value={hasAccounts ? formatCurrency(summary.netWorth) : null}
          isLoading={isLoading}
        />
        <KPICard
          label="Liquidez"
          value={hasAccounts ? formatCurrency(summary.liquidity) : null}
          isLoading={isLoading}
        />
        <KPICard
          label="Deuda"
          value={hasAccounts ? formatCurrency(summary.debt) : null}
          isLoading={isLoading}
        />
      </div>
    </SectionBlock>
  );
}