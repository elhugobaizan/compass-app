import type { Snapshot } from "@/services/snapshots";
import { toNumber } from "./numbers";

type NetWorthHistoryItem = {
  month: string;
  netWorth: number;
};

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
};

export function getPreviousNetWorthFromSnapshots(
  snapshots: Snapshot[] = []
): number {
  const snapshot = getPreviousMonthSnapshot(snapshots);
  return toNumber(snapshot?.net_worth_ars);
};

function formatMonthLabel(year: number, month: number): string {
  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString("es-AR", {
    month: "short"
  });
};

export function getNetWorthHistory(
  snapshots: Snapshot[] = [],
  limit = 6
): NetWorthHistoryItem[] {
  return [...snapshots]
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .slice(-limit)
    .map((snapshot) => ({
      month: formatMonthLabel(snapshot.year,snapshot.month),
      netWorth: toNumber(snapshot.net_worth_ars),
    }));
};