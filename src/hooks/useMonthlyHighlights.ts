import { useMemo } from "react";

import type { Transaction } from "@/types/transaction";
import type { Asset } from "@/types/asset";
import { useBillsQuery } from "@/hooks/queries/useBillsQuery";
import { useBillPaymentsByMonthQuery } from "@/hooks/queries/useBillPaymentsByMonthQuery";
import { computeMonthlyHighlights, type MonthlyHighlights } from "@/utils/homeHighlights";
import { toNumber } from "@/utils/numbers";

export function useMonthlyHighlights(
  liquidity: number,
  transactions: Transaction[] = [],
  assets: Asset[] = [],
  salary?: number,
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
        salary: salary ? toNumber(salary) : 0,
        transactions,
        assets,
        bills,
        billPayments,
      }),
    [liquidity, salary, transactions, assets, bills, billPayments],
  );
}
