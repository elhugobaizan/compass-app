import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { BillPayment } from "@/types/bill";
import { fetchBillPaymentsByMonth } from "@/services/bills";

export function useBillPaymentsByMonthQuery(
  year: number,
  month: number
): UseQueryResult<BillPayment[], Error> {
  return useQuery<BillPayment[], Error>({
    queryKey: ["bill_payments", "by-month", year, month],
    queryFn: () => fetchBillPaymentsByMonth(year, month),
    enabled: Number.isInteger(year) && Number.isInteger(month),

  });
}