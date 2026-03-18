import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useTransactionsQuery } from "@/hooks/queries/useTransactionsQuery";
import { useSnapshotsQuery } from "@/hooks/queries/useSnapshotsQuery";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";

export function useDashboardData() {
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
  } = useAccountsQuery();

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
  } = useTransactionsQuery();

  const {
    data: snapshots,
    isLoading: isLoadingSnapshots,
    isError: isErrorSnapshots,
  } = useSnapshotsQuery();

  const {
    hasAccounts,
    hasTransactions,
    hasFinancialData,
    summary,
  } = useDashboardSummary(accounts, transactions, snapshots);

  return {
    accounts,
    transactions,
    snapshots,
    summary,

    hasAccounts,
    hasTransactions,
    hasFinancialData,

    isLoadingAccounts,
    isLoadingTransactions,
    isLoadingSnapshots,

    isErrorAccounts,
    isErrorTransactions,
    isErrorSnapshots,
  };
}