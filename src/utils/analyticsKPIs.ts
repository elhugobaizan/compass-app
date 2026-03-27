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
import { filterTransactionsByPeriod, filterSnapshotsByPeriod } from "@/utils/analytics";
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
  if (period === "3m") return 3;
  if (period === "6m") return 6;
  if (period === "12m") return 12;

  const now = new Date();
  return now.getMonth() + 1;
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

function splitTransactionsForTrend(
  transactions: Transaction[]
): { current: Transaction[]; previous: Transaction[] } {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sorted.length === 0) {
    return { current: [], previous: [] };
  }

  const midpoint = Math.floor(sorted.length / 2);

  return {
    previous: sorted.slice(0, midpoint),
    current: sorted.slice(midpoint),
  };
}

function splitSnapshotsForTrend(
  snapshots: Snapshot[]
): { current: Snapshot[]; previous: Snapshot[] } {
  const sorted = [...snapshots].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  if (sorted.length === 0) {
    return { current: [], previous: [] };
  }

  const midpoint = Math.floor(sorted.length / 2);

  return {
    previous: sorted.slice(0, midpoint),
    current: sorted.slice(midpoint),
  };
}

function getLatestSnapshotNetWorth(snapshots: Snapshot[]): number {
  if (!snapshots.length) return 0;

  const latest = [...snapshots].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  })[0];

  return toNumber(latest.net_worth_ars);
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
  const filteredSnapshots = filterSnapshotsByPeriod(period, snapshots);

  let liquidity = 0;
  let debt = 0;

  for (const account of accounts) {
    const balance = toNumber(account.opening_balance);

    if (account.account_group_id === ACCOUNT_GROUPS.LIQUID) {
      liquidity += balance;
    }

    if (account.account_group_id === ACCOUNT_GROUPS.DEBT) {
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

  const txSplit = splitTransactionsForTrend(filteredTransactions);
  const currentIncome = sumIncome(txSplit.current);
  const previousIncome = sumIncome(txSplit.previous);

  const currentExpenses = sumExpenses(txSplit.current);
  const previousExpenses = sumExpenses(txSplit.previous);

  const currentSavings = currentIncome - currentExpenses;
  const previousSavings = previousIncome - previousExpenses;

  const snapshotSplit = splitSnapshotsForTrend(filteredSnapshots);
  const currentNetWorth = getLatestSnapshotNetWorth(snapshotSplit.current);
  const previousNetWorth = getLatestSnapshotNetWorth(snapshotSplit.previous);

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
      netWorth: calculateTrend(
        currentNetWorth || netWorth,
        previousNetWorth,
        "up"
      ),
      income: calculateTrend(currentIncome, previousIncome, "up"),
      expenses: calculateTrend(currentExpenses, previousExpenses, "down"),
      savings: calculateTrend(currentSavings, previousSavings, "up"),
    },
  };
}