import type { Transaction } from "@/types/transaction";
import { toNumber } from "@/utils/numbers";
import { TRANSACTION_TYPES } from "./transactionTypes";
import { TransactionListItem } from "@/types/transactionList";

export function getRecentTransactions(
  transactions: TransactionListItem[],
  count: number = 5
): TransactionListItem[] {
  return [...transactions]
    .sort(
      (a, b) => {
        let itemA;
        if(a.kind === "transfer") {
          itemA = a.date;
        } else {
          itemA = a.transaction.date;
        }
        let itemB;
        if(b.kind === "transfer") {
          itemB = b.date;
        } else {
          itemB = b.transaction.date;
        }        
        return new Date(itemB).getTime() - new Date(itemA).getTime()
      }
    )
    .slice(0, count);
}


type CategoryBreakdownItem = {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
};

function isCurrentMonth(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export function getMonthlyExpenseBreakdownByCategory(
  transactions: Transaction[] = []
): CategoryBreakdownItem[] {
  const expenses = transactions.filter(
    (transaction) =>
      transaction.type.name === TRANSACTION_TYPES.GASTO &&
      isCurrentMonth(transaction.date)
  );

  const totalsMap = expenses.reduce<Record<string, { name: string; total: number }>>(
    (acc, transaction) => {
      const categoryId = transaction.category_id ?? "uncategorized";
      const categoryName = transaction.category?.name ?? "Sin categoría";
      const amount = toNumber(transaction.amount);

      if (!acc[categoryId]) {
        acc[categoryId] = {
          name: categoryName,
          total: 0,
        };
      }

      acc[categoryId].total += amount;
      return acc;
    },
    {}
  );

  const items = Object.entries(totalsMap).map(([categoryId, value]) => ({
    categoryId,
    categoryName: value.name,
    total: value.total,
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

type MonthlySummaryItem = {
  month: string;
  income: number;
  expense: number;
};

function getMonthKey(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month));

  return date.toLocaleDateString("es-AR", {
    month: "short",
  });
}

export function getMonthlyIncomeExpense(
  transactions: Transaction[] = [],
  limit = 6
): MonthlySummaryItem[] {
  const map = transactions.reduce<Record<string, MonthlySummaryItem>>(
    (acc, tx) => {
      const key = getMonthKey(tx.date);

      if (!acc[key]) {
        acc[key] = {
          month: key,
          income: 0,
          expense: 0,
        };
      }

      const amount = toNumber(tx.amount);

      if (tx.type.name === TRANSACTION_TYPES.GASTO) {
        acc[key].expense += amount;
      } else if (tx.type.name === TRANSACTION_TYPES.INGRESO) {
        acc[key].income += amount;
      }

      return acc;
    },
    {}
  );

  return Object.values(map)
    .sort((a, b) => (a.month > b.month ? 1 : -1))
    .slice(-limit)
    .map((item) => ({
      ...item,
      month: formatMonthLabel(item.month),
    }));
}