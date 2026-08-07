import { useMemo } from "react";
import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import type { Snapshot } from "@/services/snapshots";
import type { Asset } from "@/types/asset";
import { calculateSummaryKPIs } from "@/utils/kpis";
import { Setting } from "@/types/settings";
import { toNumber } from "@/utils/numbers";
import { useExchangeRates } from "@/hooks/queries/useExchangeRates";

type DashboardSummary = {
  hasAccounts: boolean;
  hasTransactions: boolean;
  hasFinancialData: boolean;
  summary: ReturnType<typeof calculateSummaryKPIs>;
};

export function useDashboardSummary(
  accounts?: Account[],
  transactions?: Transaction[],
  snapshots?: Snapshot[],
  assets?: Asset[],
  settings?: Setting[]
): DashboardSummary {
  const rates = useExchangeRates();
  // clave estable para el useMemo (las cotizaciones cambian de referencia en cada render)
  const ratesKey = JSON.stringify(rates);

  return useMemo(() => {
    const hasAccounts = !!accounts?.length;
    const hasTransactions = !!transactions?.length;
    const hasFinancialData = hasAccounts || hasTransactions || !!assets?.length || !!settings?.length;

    const salaryValue = settings?.find((s) => s.key === "sueldo")?.value;
    const reserveValue = settings?.find((s) => s.key === "reserva")?.value;

    const summary = calculateSummaryKPIs(
      accounts ?? [],
      transactions ?? [],
      snapshots ?? [],
      assets ?? [],
      settings ?? [],
      salaryValue ? toNumber(salaryValue) : undefined,
      reserveValue ? toNumber(reserveValue) : undefined,
      rates
    );

    return {
      hasAccounts,
      hasTransactions,
      hasFinancialData,
      summary,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, transactions, snapshots, assets, settings, ratesKey]);
}