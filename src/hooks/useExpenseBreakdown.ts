import { useMemo } from "react";
import type { Transaction } from "@/types/transaction";
import { getMonthlyExpenseBreakdownByCategory } from "@/utils/transactions";

export function useExpenseBreakdown(transactions?: Transaction[]) {
  return useMemo(() => {
    return getMonthlyExpenseBreakdownByCategory(transactions ?? []);
  }, [transactions]);
}