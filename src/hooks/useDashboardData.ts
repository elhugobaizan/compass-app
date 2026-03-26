import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useTransactionsQuery } from "@/hooks/queries/useTransactionsQuery";
import { useSnapshotsQuery } from "@/hooks/queries/useSnapshotsQuery";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useAssetsQuery } from "./queries/useAssetsQuery";

export function useDashboardData() {

  const {
    data: assets,
    isLoading: isLoadingAssets,
    isError: isErrorAssets,
  } = useAssetsQuery();

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
  } = useDashboardSummary(accounts, transactions, snapshots, assets);

  return {
    accounts,
    transactions,
    snapshots,
    summary,
    assets,

    hasAccounts,
    hasTransactions,
    hasFinancialData,

    isLoadingAccounts,
    isLoadingTransactions,
    isLoadingSnapshots,
    isLoadingAssets,

    isErrorAccounts,
    isErrorTransactions,
    isErrorSnapshots,
    isErrorAssets,
  };
}