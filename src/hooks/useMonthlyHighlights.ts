import { useMemo } from "react";

import type { Transaction } from "@/types/transaction";
import type { Asset } from "@/types/asset";
import { useBillsQuery } from "@/hooks/queries/useBillsQuery";
import { useBillPaymentsByMonthQuery } from "@/hooks/queries/useBillPaymentsByMonthQuery";
import { computeMonthlyHighlights, type MonthlyHighlights } from "@/utils/homeHighlights";

export function useMonthlyHighlights(
  liquidity: number,
  transactions: Transaction[] = [],
  assets: Asset[] = [],
): MonthlyHighlights {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: bills = [] } = useBillsQuery();
  const { data: billPayments = [] } = useBillPaymentsByMonthQuery(year, month);

  return useMemo(
    () =>
      computeMonthlyHighlights({
        liquidity,
        transactions,
        assets,
        bills,
        billPayments,
      }),
    [liquidity, transactions, assets, bills, billPayments],
  );
}
