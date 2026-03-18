import { JSX, useState } from "react";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useBreakpoint } from "@/utils/utils";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import CreateTransactionSheet from "@/components/finance/CreateTransactionSheet";

import SummarySection from "./sections/SummarySection";
import AccountsSection from "./sections/AccountsSection";
import ActivitySection from "./sections/ActivitySection";
import Button from "@/components/ui/Button";

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
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories
  } = useCategoriesQuery();

  const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false);

  const isLoadingSummary =
    isLoadingAccounts || isLoadingTransactions || isLoadingSnapshots;

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <div className="flex justify-end">
        <Button
          onClick={() => setIsCreateTransactionOpen(true)}
        >+ Movimiento</Button>
      </div>

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

    <CreateTransactionSheet
      open={isCreateTransactionOpen}
      onClose={() => setIsCreateTransactionOpen(false)}
      accounts={accounts}
      categories={categories}
      isLoadingAccounts={isLoadingAccounts}
      isLoadingCategories={isLoadingCategories}
      isErrorAccounts={isErrorAccounts}
      isErrorCategories={isErrorCategories}
    />
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}