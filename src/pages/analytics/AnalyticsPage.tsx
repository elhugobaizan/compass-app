import { JSX } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { useBreakpoint } from "@/utils/utils";
import { useDashboardData } from "@/hooks/useDashboardData";
import type { AnalyticsPeriod } from "@/types/analytics";

import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { useFilteredSnapshots } from "@/hooks/useFilteredSnapshots";
import { useAnalyticsSummary } from "@/hooks/useAnalyticsSummary";
import AnalyticsSummarySection from "./sections/AnalyticsSummarySection";
import AnalyticsChartsSection from "./sections/AnalyticsChartsSection";
import AnalyticsInsightsSection from "./sections/AnalyticsInsightsSection";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useSearchParams } from "react-router-dom";

const VALID_PERIODS: Set<AnalyticsPeriod> = new Set(["3m", "6m", "12m", "ytd"]);

function getSafePeriod(value: string | null): AnalyticsPeriod {
  if (value && VALID_PERIODS.has(value as AnalyticsPeriod)) {
    return value as AnalyticsPeriod;
  }

  return "6m"
}

export default function AnalyticsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();

  const period = getSafePeriod(searchParams.get("period"));

  const {
    accounts,
    transactions,
    snapshots,
    assets,
    settings,
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

  const analyticsSummary = useAnalyticsSummary({
    accounts,
    transactions,
    snapshots,
    assets,
    settings,
    period
  })

  const isLoadingSummary =
    isLoadingAccounts ||
    isLoadingTransactions ||
    isLoadingSnapshots ||
    isLoadingAssets ||
    isLoadingSettings;

  function handlePeriodChange(nextPeriod: AnalyticsPeriod) {
    setSearchParams({ period: nextPeriod });
  }

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

      <AnalyticsFilters period={period} onPeriodChange={handlePeriodChange} />

      <AnalyticsSummarySection
        isMobile={isMobile}
        isLoading={isLoadingSummary}
        hasFinancialData={hasFinancialData}
        hasAccounts={hasAccounts}
        hasTransactions={hasTransactions}
        summary={analyticsSummary}
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
        summary={analyticsSummary}
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