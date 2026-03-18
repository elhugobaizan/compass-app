import { useMemo } from "react";
import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import type { Snapshot } from "@/services/snapshots";
import { calculateSummaryKPIs } from "@/utils/kpis";

type DashboardSummary = {
  hasAccounts: boolean;
  hasTransactions: boolean;
  hasFinancialData: boolean;
  summary: ReturnType<typeof calculateSummaryKPIs>;
};

export function useDashboardSummary(
  accounts?: Account[],
  transactions?: Transaction[],
  snapshots?: Snapshot[]
): DashboardSummary {
  return useMemo(() => {
    const hasAccounts = !!accounts?.length;
    const hasTransactions = !!transactions?.length;
    const hasFinancialData = hasAccounts || hasTransactions;

    const summary = calculateSummaryKPIs(
      accounts ?? [],
      transactions ?? [],
      snapshots ?? []
    );

    return {
      hasAccounts,
      hasTransactions,
      hasFinancialData,
      summary,
    };
  }, [accounts, transactions, snapshots]);
}