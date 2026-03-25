import { useMemo } from "react";
import type { Snapshot } from "@/services/snapshots";
import { getNetWorthHistory } from "@/utils/snapshots";

export function useNetWorthHistory(snapshots?: Snapshot[]) {
  return useMemo(() => {
    return getNetWorthHistory(snapshots ?? []);
  }, [snapshots]);
};