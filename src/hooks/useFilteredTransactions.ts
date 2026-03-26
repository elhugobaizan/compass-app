import { useMemo } from "react";
import type { Transaction } from "@/types/transaction";
import type { AnalyticsPeriod } from "@/types/analytics";
import { filterTransactionsByPeriod } from "@/utils/analytics";

export function useFilteredTransactions(
  transactions: Transaction[] | undefined,
  period: AnalyticsPeriod
) {
  return useMemo(() => {
    return filterTransactionsByPeriod(period, transactions ?? []);
  }, [transactions, period]);
}