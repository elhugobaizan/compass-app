import type { Transaction } from "@/types/transaction";
import { TRANSACTION_TYPES } from "./transactionTypes";
import { toNumber } from "./numbers";
import { pad2 } from "./date";

export type DailyExpensePoint = {
  day: number;
  label: string;
  total: number;
};

/**
 * Gasto total por día del mes en curso, del día 1 hasta hoy.
 * Solo considera transacciones tipo GASTO.
 */
export function getDailyExpensesForMonth(
  transactions: Transaction[] = [],
  ref: Date = new Date(),
): DailyExpensePoint[] {
  const year = ref.getFullYear();
  const month = ref.getMonth() + 1; // 1-based
  const today = ref.getDate();
  const monthPrefix = `${year}-${pad2(month)}`;

  const totals = new Array<number>(today + 1).fill(0);

  for (const tx of transactions) {
    if (tx.type?.name !== TRANSACTION_TYPES.GASTO) continue;

    const key = String(tx.date).slice(0, 10);
    if (!key.startsWith(monthPrefix)) continue;

    const day = Number(key.slice(8, 10));
    if (day >= 1 && day <= today) {
      totals[day] += toNumber(tx.amount);
    }
  }

  const points: DailyExpensePoint[] = [];
  for (let day = 1; day <= today; day++) {
    points.push({ day, label: pad2(day), total: totals[day] });
  }

  return points;
}
