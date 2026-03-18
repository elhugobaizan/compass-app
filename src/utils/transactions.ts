import type { Transaction } from "@/types/transaction";

export function getRecentTransactions(
  transactions: Transaction[],
  count: number = 5
): Transaction[] {
  return [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, count);
}
