// src/hooks/queries/useTransactionsByMonthQuery.ts
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/transactions";
import type { Transaction } from "@/types/transaction";
import { pad2 } from "@/utils/date";

// Las fechas se guardan como YYYY-MM-DDT00:00:00.000Z (medianoche UTC),
// así que el rango del mes se construye con límites UTC para coincidir
// exactamente con el día calendario almacenado.
function monthRangeUtc(month: Date): { from: string; to: string; key: string } {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const nextYear = monthIndex === 11 ? year + 1 : year;
  const nextMonthIndex = monthIndex === 11 ? 0 : monthIndex + 1;

  return {
    from: `${year}-${pad2(monthIndex + 1)}-01T00:00:00.000Z`,
    to: `${nextYear}-${pad2(nextMonthIndex + 1)}-01T00:00:00.000Z`,
    key: `${year}-${pad2(monthIndex + 1)}`,
  };
}

export function useTransactionsByMonthQuery(month: Date) {
  const { from, to, key } = monthRangeUtc(month);

  return useQuery<Transaction[]>({
    queryKey: ["transactions", "byMonth", key],
    queryFn: () =>
      getTransactions({ from, to, take: 1000, orderBy: { date: "desc" } }),
  });
}
