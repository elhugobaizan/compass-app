import type { AnalyticsPeriod } from "@/types/analytics";
import type { Transaction } from "@/types/transaction";
import type { Snapshot } from "@/services/snapshots";

function getPeriodStartDate(period: AnalyticsPeriod): Date {
  const now = new Date();

  if (period === "3m") {
    return new Date(now.getFullYear(), now.getMonth() - 2, 1);
  }

  if (period === "6m") {
    return new Date(now.getFullYear(), now.getMonth() - 5, 1);
  }

  if (period === "12m") {
    return new Date(now.getFullYear(), now.getMonth() - 11, 1);
  }

  // ytd
  return new Date(now.getFullYear(), 0, 1);
}

export function filterTransactionsByPeriod(
  period: AnalyticsPeriod,
  transactions: Transaction[] = []
): Transaction[] {
  const start = getPeriodStartDate(period);

  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return date >= start;
  });
}

export function filterSnapshotsByPeriod(
  period: AnalyticsPeriod,
  snapshots: Snapshot[] = []
): Snapshot[] {
  const start = getPeriodStartDate(period);

  return snapshots.filter((snapshot) => {
    const date = new Date(snapshot.year, snapshot.month - 1, 1);
    return date >= start;
  });
}