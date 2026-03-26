import { useMemo } from "react";
import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import type { Asset } from "@/types/asset";
import type { Setting } from "@/types/settings";
import type { Snapshot } from "@/services/snapshots";
import type { AnalyticsPeriod } from "@/types/analytics";

import { filterTransactionsByPeriod, filterSnapshotsByPeriod } from "@/utils/analytics";
import { calculateSummaryKPIs } from "@/utils/kpis";

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
    const filteredTransactions = filterTransactionsByPeriod(
      period,
      transactions ?? []
    );

    const filteredSnapshots = filterSnapshotsByPeriod(
      period,
      snapshots ?? []
    );

    const summary = calculateSummaryKPIs(
      accounts ?? [],
      filteredTransactions,
      filteredSnapshots,
      assets ?? [],
      settings ?? []
    );

    return summary;
  }, [accounts, transactions, snapshots, assets, settings, period]);
}