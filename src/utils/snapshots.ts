import type { Snapshot } from "@/services/snapshots";
import { toNumber } from "./numbers";

export function getPreviousMonthSnapshot(
  snapshots: Snapshot[] = []
): Snapshot | undefined {
  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return snapshots.find(
    (snapshot) =>
      snapshot.year === prev.getFullYear() &&
      snapshot.month === prev.getMonth() + 1
  );
}

export function getPreviousNetWorthFromSnapshots(
  snapshots: Snapshot[] = []
): number {
  const snapshot = getPreviousMonthSnapshot(snapshots);
  return toNumber(snapshot?.net_worth_ars);
}