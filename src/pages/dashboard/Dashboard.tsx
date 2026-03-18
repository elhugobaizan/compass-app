import { JSX } from "react";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useBreakpoint } from "@/utils/utils";
import { useDashboardData } from "@/hooks/useDashboardData";

import SummarySection from "./sections/SummarySection";
import AccountsSection from "./sections/AccountsSection";
import ActivitySection from "./sections/ActivitySection";

export default function Dashboard(): JSX.Element {
  const { isMobile } = useBreakpoint();

  const {
    accounts,
    transactions,
    summary,
    hasAccounts,
    hasTransactions,
    hasFinancialData,
    isLoadingAccounts,
    isLoadingTransactions,
    isLoadingSnapshots,
    isErrorAccounts,
    isErrorTransactions,
  } = useDashboardData();

  const isLoadingSummary =
    isLoadingAccounts || isLoadingTransactions || isLoadingSnapshots;

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <SummarySection
        isMobile={isMobile}
        isLoading={isLoadingSummary}
        hasFinancialData={hasFinancialData}
        hasAccounts={hasAccounts}
        hasTransactions={hasTransactions}
        summary={summary}
      />

      <AccountsSection
        isMobile={isMobile}
        accounts={accounts}
        transactions={transactions}
        isLoading={isLoadingAccounts}
        isError={isErrorAccounts}
      />

      <ActivitySection
        isMobile={isMobile}
        transactions={transactions}
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