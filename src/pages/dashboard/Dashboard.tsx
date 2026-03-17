import { JSX } from 'react';
import LayoutMobile from "../../layouts/LayoutMobile";
import LayoutWeb from "../../layouts/LayoutWeb";
import {useBreakpoint} from "../../utils/utils";
import { useDashboardData } from '@/hooks/useDashboardData';
import SummarySection from './sections/SummarySection';
import AccountsSection from './sections/AccountsSection';
import ActivitySection from './sections/ActivitySection';

export default function Dashboard(): JSX.Element {
  const { isMobile } = useBreakpoint();

  const {
    accounts, transactions, summary,
    hasAccounts, hasFinancialData,
    isLoadingAccounts, isLoadingTransactions,
    isErrorAccounts, isErrorTransactions
  } = useDashboardData();

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <SummarySection 
        isMobile={isMobile}
        isLoading={isLoadingAccounts}
        hasFinancialData={hasFinancialData}
        hasAccounts={hasAccounts}
        summary={summary}
      />

      <AccountsSection  
        isMobile={isMobile}
        accounts={accounts}
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