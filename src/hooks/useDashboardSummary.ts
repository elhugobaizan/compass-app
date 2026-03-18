import { Account } from "@/types/account";
import { Transaction } from "@/types/transaction";
import { calculateSummaryKPIs, SummaryKPIs } from "@/utils/kpis";
import { useMemo } from "react";

type DashboardSummary = {
  hasAccounts: boolean;
  hasTransactions: boolean;
  hasFinancialData: boolean;
  summary: SummaryKPIs;
}

export function useDashboardSummary(
  accounts?: Account[],
  transactions?: Transaction[]
): DashboardSummary {
  return useMemo(() => {
    const hasAccounts = !!accounts?.length;
    const hasTransactions = !!transactions?.length;
    const hasFinancialData = hasAccounts || hasTransactions;
    const summary = calculateSummaryKPIs(accounts ?? [], transactions ?? []);

    return {
      hasAccounts,
      hasTransactions,
      hasFinancialData,
      summary
    }
  }, [accounts, transactions]);
};

