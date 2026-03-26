import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useBreakpoint } from "@/utils/utils";
import { JSX } from "react";
import AnalyticsSummarySection from "./sections/AnalyticsSummarySection";
import AnalyticsChartsSection from "./sections/AnalyticsChartsSection";
import AnalyticsInsightsSection from "./sections/AnalyticsInsightsSection";
import { useDashboardData } from "@/hooks/useDashboardData";
import PageHeader from "@/components/ui/PageHeader";

export default function AnalyticsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();

  const {
    transactions,
    snapshots,
    summary,
    hasAccounts,
    hasTransactions,
    hasFinancialData,
    isLoadingAccounts,
    isLoadingAssets,
    isLoadingSettings,
    isLoadingSnapshots,
    isLoadingTransactions,
    isErrorTransactions,
    isErrorSnapshots
  } = useDashboardData();

  const isLoadingSummary = isLoadingAccounts || isLoadingTransactions || isLoadingAssets || isLoadingSettings || isLoadingSnapshots;

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title=""
        description={isMobile ? undefined : 'Evolución patrimonial, breakdowns y métricas financieras'}
      />
      <AnalyticsSummarySection 
        isMobile={isMobile}
        isLoading={isLoadingSummary}
        hasFinancialData={hasFinancialData}
        hasAccounts={hasAccounts}
        hasTransactions={hasTransactions}
        summary={summary}
      />

      <AnalyticsChartsSection 
        isMobile={isMobile}
        transactions={transactions ?? []}
        snapshots={snapshots ?? []}
        isLoadingTransactions={isLoadingTransactions}
        isLoadingSnapshots={isLoadingSnapshots}
        isErrorTransactions={isErrorTransactions}
        isErrorSnapshots={isErrorSnapshots}
      />

      <AnalyticsInsightsSection 
        isMobile={isMobile}
        transactions={transactions ?? []}
        summary={summary}
        isLoading={isLoadingTransactions}
        isError={isErrorTransactions}
      />
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}