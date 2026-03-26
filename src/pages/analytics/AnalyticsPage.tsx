import { JSX, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { useBreakpoint } from "@/utils/utils";
import { useDashboardData } from "@/hooks/useDashboardData";
import type { AnalyticsPeriod } from "@/types/analytics";

import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { useFilteredSnapshots } from "@/hooks/useFilteredSnapshots";

import AnalyticsSummarySection from "./sections/AnalyticsSummarySection";
import AnalyticsChartsSection from "./sections/AnalyticsChartsSection";
import AnalyticsInsightsSection from "./sections/AnalyticsInsightsSection";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";

export default function AnalyticsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();
  const [period, setPeriod] = useState<AnalyticsPeriod>("6m");

  const {
    transactions,
    snapshots,
    summary,
    hasAccounts,
    hasTransactions,
    hasFinancialData,
    isLoadingAccounts,
    isLoadingTransactions,
    isLoadingSnapshots,
    isLoadingAssets,
    isLoadingSettings,
    isErrorTransactions,
    isErrorSnapshots,
  } = useDashboardData();

  const filteredTransactions = useFilteredTransactions(transactions, period);
  const filteredSnapshots = useFilteredSnapshots(snapshots, period);

  const isLoadingSummary =
    isLoadingAccounts ||
    isLoadingTransactions ||
    isLoadingSnapshots ||
    isLoadingAssets ||
    isLoadingSettings;

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title=""
        description={
          isMobile
            ? undefined
            : "Evolución patrimonial, breakdowns y métricas financieras"
        }
      />

      <AnalyticsFilters period={period} onPeriodChange={setPeriod} />

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
        transactions={filteredTransactions}
        snapshots={filteredSnapshots}
        isLoadingTransactions={isLoadingTransactions}
        isLoadingSnapshots={isLoadingSnapshots}
        isErrorTransactions={isErrorTransactions}
        isErrorSnapshots={isErrorSnapshots}
      />

      <AnalyticsInsightsSection
        isMobile={isMobile}
        transactions={filteredTransactions}
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