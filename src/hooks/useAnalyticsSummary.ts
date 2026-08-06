import { useMemo } from "react";
import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import type { Asset } from "@/types/asset";
import type { Setting } from "@/types/settings";
import type { Snapshot } from "@/services/snapshots";
import type { AnalyticsPeriod } from "@/types/analytics";

import { calculateAnalyticsKPIs } from "@/utils/analyticsKPIs";
import { useDollarRate } from "@/hooks/queries/useDollarRate";

type UseAnalyticsSummaryParams = {
  accounts?: Account[];
  transactions?: Transaction[];
  snapshots?: Snapshot[];
  assets?: Asset[];
  settings?: Setting[];
  period: AnalyticsPeriod;
};

export function useAnalyticsSummary({
  accounts,
  transactions,
  snapshots,
  assets,
  settings,
  period,
}: UseAnalyticsSummaryParams) {
  const { data: dollar } = useDollarRate();
  const usdRate = dollar ? (dollar.compra + dollar.venta) / 2 : undefined;

  return useMemo(() => {
    return calculateAnalyticsKPIs({
      accounts,
      transactions,
      snapshots,
      assets,
      settings,
      period,
      usdRate,
    });

  }, [accounts, transactions, snapshots, assets, settings, period, usdRate]);
}