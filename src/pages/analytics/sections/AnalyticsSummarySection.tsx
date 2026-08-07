import KPICard from "@/components/finance/KPICard";
import SectionBlock from "@/components/ui/SectionBlock";
import ForeignCurrencyModal from "@/components/finance/ForeignCurrencyModal";
import NetWorthBreakdownModal from "@/components/finance/NetWorthBreakdownModal";
import { AnalyticsKPIs } from "@/utils/analyticsKPIs";
import { formatCurrency } from "@/utils/formatters";
import { useExchangeRates } from "@/hooks/queries/useExchangeRates";
import { JSX, useState } from "react";

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
  const [isForeignOpen, setIsForeignOpen] = useState(false);
  const [isNetWorthOpen, setIsNetWorthOpen] = useState(false);
  const rates = useExchangeRates();

  return (
    <SectionBlock
      title="Resumen ampliado"
      subtitle={isMobile ? undefined : "Métricas clave del período actual"}
    >
      {!hasFinancialData && !isLoading && (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-muted)]">
          Todavía no hay datos suficientes para mostrar analítica
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KPICard
          label="Patrimonio neto"
          value={hasAccounts ? formatCurrency(summary.netWorth) : null}
          subvalue="Tocá para ver la composición"
          isLoading={isLoading}
          tone="neutral"
          trend={summary.trends.netWorth}
          onClick={() => setIsNetWorthOpen(true)}
        />
        <KPICard
          label="Liquidez"
          value={hasAccounts ? formatCurrency(summary.liquidity) : null}
          isLoading={isLoading}
          tone="positive"
        />
        {summary.foreignCurrency > 0 && (
          <KPICard
            label="Divisas"
            value={formatCurrency(summary.foreignCurrency)}
            subvalue="Reserva · tocá para ver el detalle"
            isLoading={isLoading}
            tone="info"
            onClick={() => setIsForeignOpen(true)}
          />
        )}
        <KPICard
          label="Inversiones"
          value={hasAccounts ? formatCurrency(summary.investments) : null}
          isLoading={isLoading}
          tone="info"
        />
        {summary.debt !== 0 && (
          <KPICard
            label="Deuda"
            value={hasAccounts ? formatCurrency(summary.debt) : null}
            isLoading={isLoading}
            tone="negative"
          />
        )}
        {summary.receivables > 0 && (
          <KPICard
            label="Me deben"
            value={formatCurrency(summary.receivables)}
            subvalue="No cuenta como liquidez"
            isLoading={isLoading}
            tone="info"
          />
        )}
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

      <p className="mt-3 text-xs text-[var(--color-muted)]">
        Nota: la Liquidez cuenta solo cuentas en pesos (las divisas van aparte, como
        reserva) y acá no descuenta la reserva de ahorro, a diferencia del Home.
      </p>

      <ForeignCurrencyModal
        open={isForeignOpen}
        onClose={() => setIsForeignOpen(false)}
        accounts={summary.foreignAccounts}
        total={summary.foreignCurrency}
        rates={rates}
      />

      <NetWorthBreakdownModal
        open={isNetWorthOpen}
        onClose={() => setIsNetWorthOpen(false)}
        blocks={summary.netWorthBreakdown}
        total={summary.netWorth}
      />
    </SectionBlock>
  );
}