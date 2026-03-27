import { useMemo } from "react";
import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import type { Asset } from "@/types/asset";
import type { Setting } from "@/types/settings";
import type { Snapshot } from "@/services/snapshots";
import type { AnalyticsPeriod } from "@/types/analytics";

import { calculateAnalyticsKPIs } from "@/utils/analyticsKPIs";

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
  return useMemo(() => {
    return calculateAnalyticsKPIs({
      accounts,
      transactions,
      snapshots,
      assets,
      settings,
      period
    });

  }, [accounts, transactions, snapshots, assets, settings, period]);
}