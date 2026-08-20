import type { Transaction } from "@/types/transaction";
import { TRANSACTION_TYPES } from "./transactionTypes";
import { toNumber } from "./numbers";

export type LocationBreakdownItem = {
  locationId: number;
  locationName: string;
  total: number;
  count: number;
  percentage: number;
};

/**
 * Gastos agrupados por lugar, de mayor a menor.
 * Los movimientos sin lugar quedan afuera (no aportan información acá).
 */
export function getExpenseBreakdownByLocation(
  transactions: Transaction[] = [],
): LocationBreakdownItem[] {
  const totals = new Map<number, { name: string; total: number; count: number }>();

  for (const tx of transactions) {
    if (tx.type?.name !== TRANSACTION_TYPES.GASTO) continue;

    const location = tx.location_ref;
    if (!location) continue;

    const current = totals.get(location.id) ?? {
      name: location.name,
      total: 0,
      count: 0,
    };

    current.total += toNumber(tx.amount);
    current.count += 1;
    totals.set(location.id, current);
  }

  const items = [...totals.entries()].map(([locationId, value]) => ({
    locationId,
    locationName: value.name,
    total: value.total,
    count: value.count,
    percentage: 0,
  }));

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  return items
    .map((item) => ({
      ...item,
      percentage: grandTotal > 0 ? (item.total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}
