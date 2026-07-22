import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import type { Snapshot } from "@/services/snapshots";
import type { Asset } from "@/types/asset";
import type { Setting } from "@/types/settings";
import type { AnalyticsPeriod } from "@/types/analytics";

import { ACCOUNT_GROUPS } from "@/utils/accountGroups";
import { toNumber } from "@/utils/numbers";
import { getTotalAssetsValue } from "@/utils/assets";
import { getNetWorthExtrasFromSettings } from "@/utils/settings";
import { filterTransactionsByPeriod } from "@/utils/analytics";
import { toDateKey } from "@/utils/date";
import { TRANSACTION_TYPES } from "./transactionTypes";

type TrendDirection = "up" | "down" | "neutral";
type TrendSentiment = "positive" | "negative" | "neutral";

export type AnalyticsTrend = {
  value: string;
  direction: TrendDirection;
  sentiment: TrendSentiment;
};

export type AnalyticsKPIs = {
  netWorth: number;
  liquidity: number;
  investments: number;
  debt: number;

  periodIncome: number;
  periodExpenses: number;
  periodSavings: number;

  averageMonthlyIncome: number;
  averageMonthlyExpenses: number;
  averageMonthlySavings: number;

  trends: {
    netWorth?: AnalyticsTrend;
    income?: AnalyticsTrend;
    expenses?: AnalyticsTrend;
    savings?: AnalyticsTrend;
  };
};

function getPeriodMonthCount(period: AnalyticsPeriod): number {
  if (period === "1m") return 1;
  if (period === "3m") return 3;
  if (period === "6m") return 6;
  return 12;
}

function calculateTrend(
  current: number,
  previous: number,
  goodWhen: "up" | "down"
): AnalyticsTrend | undefined {
  if (!previous) return undefined;

  const change = (current - previous) / previous;
  const percentage = Math.abs(change * 100).toFixed(0);

  let direction: TrendDirection = "neutral";
  if (change > 0) direction = "up";
  if (change < 0) direction = "down";

  let sentiment: TrendSentiment = "neutral";
  if (direction !== "neutral") {
    sentiment = direction === goodWhen ? "positive" : "negative";
  }

  const prefix = direction === "up" ? "+" : direction === "down" ? "-" : "";

  return {
    value:
      direction === "neutral"
        ? "0% vs período anterior"
        : `${prefix}${percentage}% vs período anterior`,
    direction,
    sentiment,
  };
}

function sumIncome(transactions: Transaction[]): number {
  return transactions
    .filter((tx) => tx.type.name === TRANSACTION_TYPES.INGRESO)
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);
}

function sumExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((tx) => tx.type.name === TRANSACTION_TYPES.GASTO)
    .reduce((sum, tx) => sum + toNumber(tx.amount), 0);
}

function txInRange(
  transactions: Transaction[],
  startKey: string,
  endKeyExclusive: string,
): Transaction[] {
  return transactions.filter((tx) => {
    const key = String(tx.date).slice(0, 10);
    return key >= startKey && key < endKeyExclusive;
  });
}

/** Net worth registrado en un mes puntual (año/mes), o null si no hay snapshot. */
function getSnapshotNetWorthAt(
  snapshots: Snapshot[],
  year: number,
  month: number,
): number | null {
  const match = snapshots.find((s) => s.year === year && s.month === month);
  return match ? toNumber(match.net_worth_ars) : null;
}

export function calculateAnalyticsKPIs(params: {
  accounts?: Account[];
  transactions?: Transaction[];
  snapshots?: Snapshot[];
  assets?: Asset[];
  settings?: Setting[];
  period: AnalyticsPeriod;
}): AnalyticsKPIs {
  const {
    accounts = [],
    transactions = [],
    snapshots = [],
    assets = [],
    settings = [],
    period,
  } = params;

  const filteredTransactions = filterTransactionsByPeriod(period, transactions);

  let liquidity = 0;
  let debt = 0;

  for (const account of accounts) {
    const balance = toNumber(account.opening_balance);

    if (account.account_group.name === ACCOUNT_GROUPS.LIQUID) {
      liquidity += balance;
    }

    if (account.account_group.name === ACCOUNT_GROUPS.DEBT) {
      debt += balance;
    }
  }

  const investments = getTotalAssetsValue(assets);
  const netWorthExtras = getNetWorthExtrasFromSettings(settings);
  const netWorth = liquidity + investments + netWorthExtras;

  const periodIncome = sumIncome(filteredTransactions);
  const periodExpenses = sumExpenses(filteredTransactions);
  const periodSavings = periodIncome - periodExpenses;

  const monthCount = getPeriodMonthCount(period);

  const averageMonthlyIncome = periodIncome / monthCount;
  const averageMonthlyExpenses = periodExpenses / monthCount;
  const averageMonthlySavings = periodSavings / monthCount;

  // Ventana actual = últimos N meses; ventana anterior = los N meses previos.
  const now = new Date();
  const currentStart = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1), 1);
  const previousStart = new Date(now.getFullYear(), now.getMonth() - (2 * monthCount - 1), 1);

  const currentStartKey = toDateKey(currentStart);
  const previousStartKey = toDateKey(previousStart);
  // fin de la ventana actual: mañana (para incluir hoy)
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const currentEndKey = toDateKey(tomorrow);

  const currentTx = txInRange(transactions, currentStartKey, currentEndKey);
  const previousTx = txInRange(transactions, previousStartKey, currentStartKey);

  const currentIncome = sumIncome(currentTx);
  const previousIncome = sumIncome(previousTx);

  const currentExpenses = sumExpenses(currentTx);
  const previousExpenses = sumExpenses(previousTx);

  const currentSavings = currentIncome - currentExpenses;
  const previousSavings = previousIncome - previousExpenses;

  // Patrimonio: actual vs snapshot del inicio del período (hace N meses).
  const previousNetWorth =
    getSnapshotNetWorthAt(snapshots, currentStart.getFullYear(), currentStart.getMonth() + 1) ?? 0;

  return {
    netWorth,
    liquidity,
    investments,
    debt,

    periodIncome,
    periodExpenses,
    periodSavings,

    averageMonthlyIncome,
    averageMonthlyExpenses,
    averageMonthlySavings,

    trends: {
      netWorth: calculateTrend(netWorth, previousNetWorth, "up"),
      income: calculateTrend(currentIncome, previousIncome, "up"),
      expenses: calculateTrend(currentExpenses, previousExpenses, "down"),
      savings: calculateTrend(currentSavings, previousSavings, "up"),
    },
  };
}