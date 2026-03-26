import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useTransactionsQuery } from "@/hooks/queries/useTransactionsQuery";
import { useSnapshotsQuery } from "@/hooks/queries/useSnapshotsQuery";
import { useAssetsQuery } from "./queries/useAssetsQuery";
import { useSettingsQuery } from "./queries/useSettingsQuery";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";

export function useDashboardData() {

  const {
    data: settings,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
  } = useSettingsQuery();

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
  } = useDashboardSummary(accounts, transactions, snapshots, assets, settings);

  return {
    accounts,
    transactions,
    snapshots,
    summary,
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

    isErrorAccounts,
    isErrorTransactions,
    isErrorSnapshots,
    isErrorAssets,
    isErrorSettings,
  };
}