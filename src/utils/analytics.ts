import type { AnalyticsPeriod } from "@/types/analytics";
import type { Transaction } from "@/types/transaction";
import type { Snapshot } from "@/services/snapshots";
import { pad2, toDateKey } from "@/utils/date";

function getPeriodStartDate(period: AnalyticsPeriod): Date {
  const now = new Date();

  if (period === "1m") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  if (period === "3m") {
    return new Date(now.getFullYear(), now.getMonth() - 2, 1);
  }

  if (period === "6m") {
    return new Date(now.getFullYear(), now.getMonth() - 5, 1);
  }

  // 12m
  return new Date(now.getFullYear(), now.getMonth() - 11, 1);
}

export function filterTransactionsByPeriod(
  period: AnalyticsPeriod,
  transactions: Transaction[] = []
): Transaction[] {
  // Comparación por clave de fecha (YYYY-MM-DD) para evitar el corrimiento
  // de timezone: las fechas se guardan como UTC midnight.
  const startKey = toDateKey(getPeriodStartDate(period));

  return transactions.filter(
    (transaction) => String(transaction.date).slice(0, 10) >= startKey,
  );
}

export function filterSnapshotsByPeriod(
  period: AnalyticsPeriod,
  snapshots: Snapshot[] = []
): Snapshot[] {
  const start = getPeriodStartDate(period);
  const startKey = `${start.getFullYear()}-${pad2(start.getMonth() + 1)}`;

  return snapshots.filter(
    (snapshot) => `${snapshot.year}-${pad2(snapshot.month)}` >= startKey,
  );
}