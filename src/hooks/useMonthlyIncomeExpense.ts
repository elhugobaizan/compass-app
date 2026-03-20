import { useMemo } from "react";
import type { Transaction } from "@/types/transaction";
import { getMonthlyIncomeExpense } from "@/utils/transactions";

export function useMonthlyIncomeExpense(transactions?: Transaction[]) {
  return useMemo(() => {
    return getMonthlyIncomeExpense(transactions ?? []);
  }, [transactions]);
};