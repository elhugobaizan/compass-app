import { useAccountsQuery } from "./queries/useAccountsQuery";
import { useTransactionsQuery } from "./queries/useTransactionsQuery";
import { useDashboardSummary } from "./useDashboardSummary";

export function useDashboardData() {
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts
  } = useAccountsQuery();

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions
  } = useTransactionsQuery();

  const {
    hasAccounts,
    hasTransactions,
    hasFinancialData,
    summary
  } = useDashboardSummary(accounts, transactions);

  return {
    accounts,
    transactions,
    summary,

    hasAccounts,
    hasTransactions,
    hasFinancialData,

    isLoadingAccounts,
    isLoadingTransactions,

    isErrorAccounts,
    isErrorTransactions
  }
};