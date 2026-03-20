import type { Transaction } from "@/types/transaction";
import { toNumber } from "@/utils/numbers";

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
      transaction.type_id === "2bc1382d-90b2-45ae-b91f-e7d3fd155b2d" &&
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