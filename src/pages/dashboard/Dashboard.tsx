import { JSX, useState } from "react";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useBreakpoint } from "@/utils/utils";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import CreateTransactionSheet from "@/components/finance/CreateTransactionSheet";
import CreateAssetSheet from "@/components/finance/CreateAssetSheet";
import CreateAccountSheet from "@/components/finance/CreateAccountSheet";

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
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

  const isLoadingSummary =
    isLoadingAccounts || isLoadingTransactions || isLoadingSnapshots;

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={() => setIsCreateAccountOpen(true)}>
          + Cuenta
        </Button>
        
        <Button variant="secondary" onClick={() => setIsCreateAssetOpen(true)}>
          + Asset
        </Button>

        <Button onClick={() => setIsCreateTransactionOpen(true)}>
          + Movimiento
        </Button>
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

      <CreateAssetSheet
        open={isCreateAssetOpen}
        onClose={() => setIsCreateAssetOpen(false)}
        accounts={accounts}
        isLoadingAccounts={isLoadingAccounts}
        isErrorAccounts={isErrorAccounts}
      />

      <CreateAccountSheet
        open={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
      />      
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}