import { useEffect, useRef } from "react";

import type { Snapshot } from "@/services/snapshots";
import type { SummaryKPIs } from "@/utils/kpis";
import { useCreateSnapshot } from "@/hooks/mutations/useCreateSnapshot";
import { pad2 } from "@/utils/date";

type UseMonthlySnapshotArgs = {
  snapshots?: Snapshot[];
  summary: SummaryKPIs;
  exchangeRate?: number;
  isReady: boolean;
};

/**
 * Al cargar el Dashboard, si no existe un snapshot para el mes actual,
 * lo crea automáticamente con los valores del resumen actual (Opción A:
 * el snapshot se etiqueta con el mes en curso).
 */
export function useMonthlySnapshot({
  snapshots,
  summary,
  exchangeRate,
  isReady,
}: UseMonthlySnapshotArgs): void {
  const { mutate: createSnapshot } = useCreateSnapshot();
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!isReady || attemptedRef.current || !snapshots) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const exists = snapshots.some(
      (s) => s.year === year && s.month === month,
    );
    if (exists) return;

    attemptedRef.current = true;

    const netWorthUsd =
      exchangeRate && exchangeRate > 0
        ? summary.netWorth / exchangeRate
        : null;

    createSnapshot({
      year,
      month,
      period: `${year}-${pad2(month)}`,
      net_worth_ars: summary.netWorth,
      net_worth_usd: netWorthUsd,
      liquidity: summary.liquidity,
      investments: summary.investments,
      debt: summary.debt,
      exchange_rate: exchangeRate ?? null,
    });
  }, [isReady, snapshots, summary, exchangeRate, createSnapshot]);
}
