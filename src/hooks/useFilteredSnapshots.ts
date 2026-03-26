import { useMemo } from "react";
import type { Snapshot } from "@/services/snapshots";
import type { AnalyticsPeriod } from "@/types/analytics";
import { filterSnapshotsByPeriod } from "@/utils/analytics";

export function useFilteredSnapshots(
  snapshots: Snapshot[] | undefined,
  period: AnalyticsPeriod
) {
  return useMemo(() => {
    return filterSnapshotsByPeriod(period, snapshots ?? []);
  }, [snapshots, period]);
}