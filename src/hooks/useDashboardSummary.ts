import { Account } from "@/types/account";
import { Transaction } from "@/types/transaction";
import { calculateSummaryKPIs } from "@/utils/kpis";
import { useMemo } from "react";

type DashboardSummary = {
  hasAccounts: boolean;
  hasTransactions: boolean;
  hasFinancialData: boolean;
  summary: {
    netWorth: number;
    liquidity: number;
    debt: number;
    investments: number;
  };
}

export function useDashboardSummary(
  accounts?: Account[],
  transactions?: Transaction[]
): DashboardSummary {
  return useMemo(() => {
    const hasAccounts = !!accounts?.length;
    const hasTransactions = !!transactions?.length;
    const hasFinancialData = hasAccounts || hasTransactions;
    const summary = calculateSummaryKPIs(accounts ?? []);

    return {
      hasAccounts,
      hasTransactions,
      hasFinancialData,
      summary
    }
  }, [accounts, transactions]);
};

