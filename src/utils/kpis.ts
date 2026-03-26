import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import type { Snapshot } from "@/services/snapshots";
import { ACCOUNT_GROUPS } from "./accountGroups";
import { toNumber } from "./numbers";
import { isSameMonth, isPreviousMonth } from "./date";
import { getPreviousNetWorthFromSnapshots } from "./snapshots";
import { TRANSACTION_TYPES } from "./transactionTypes";
import { Asset } from "@/types/asset";
import { getTotalAssetsValue } from "./assets";

type TrendDirection = "up" | "down" | "neutral";
type TrendSentiment = "positive" | "negative" | "neutral";

type Trend = {
  value: string;
  direction: TrendDirection;
  sentiment: TrendSentiment;
};

type SummaryKPIs = {
  netWorth: number;
  liquidity: number;
  debt: number;
  investments: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  trends: {
    netWorth?: Trend;
    income?: Trend;
    expenses?: Trend;
    savings?: Trend;
  };
};

function calculateMonthlyAmounts(
  transactions: Transaction[],
  type: string
) {
  const now = new Date();

  return transactions.reduce(
    (acc, tx) => {
      if (tx.type.name !== type) return acc;

      const amount = toNumber(tx.amount);

      if (isSameMonth(tx.date, now)) {
        acc.current += amount;
      }

      if (isPreviousMonth(tx.date, now)) {
        acc.previous += amount;
      }

      return acc;
    },
    { current: 0, previous: 0 }
  );
}

function calculateTrend(
  current: number,
  previous: number,
  goodWhen: "up" | "down"
): Trend | undefined {
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
        ? "0% vs mes anterior"
        : `${prefix}${percentage}% vs mes anterior`,
    direction,
    sentiment,
  };
}

export function calculateSummaryKPIs(
  accounts: Account[] = [],
  transactions: Transaction[] = [],
  snapshots: Snapshot[] = [],
  assets: Asset[] = []
): SummaryKPIs {
  const base: SummaryKPIs = {
    netWorth: 0,
    liquidity: 0,
    debt: 0,
    investments: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
    trends: {
      netWorth: undefined,
      income: undefined,
      expenses: undefined,
      savings: undefined,
    },
  };

  const withAccounts = accounts.reduce((acc, account) => {
    const balance = toNumber(account.opening_balance);

    acc.netWorth += balance;
    
    if (account.account_group.name === ACCOUNT_GROUPS.LIQUID) {
      acc.liquidity += balance;
    }
    
    if (account.account_group.name === ACCOUNT_GROUPS.INVESTMENT) {
      acc.investments += balance;
    }
    
    if (account.account_group.name === ACCOUNT_GROUPS.DEBT) {
      acc.debt += balance;
    }
    
    return acc;
  }, base);
  const totalAssetsValue = getTotalAssetsValue(assets);
  withAccounts.netWorth += totalAssetsValue;
  withAccounts.investments += totalAssetsValue;
  
  const income = calculateMonthlyAmounts(transactions, TRANSACTION_TYPES.INGRESO);
  const expenses = calculateMonthlyAmounts(transactions, TRANSACTION_TYPES.GASTO);

  withAccounts.monthlyIncome = income.current;
  withAccounts.monthlyExpenses = expenses.current;
  withAccounts.monthlySavings = income.current - expenses.current;

  withAccounts.trends.income = calculateTrend(
    income.current,
    income.previous,
    "up"
  );

  withAccounts.trends.expenses = calculateTrend(
    expenses.current,
    expenses.previous,
    "down"
  );

  const previousNetWorth = getPreviousNetWorthFromSnapshots(snapshots);

  withAccounts.trends.netWorth = calculateTrend(
    withAccounts.netWorth,
    previousNetWorth,
    "up"
  );

  const previousSavings = income.previous - expenses.previous;

  withAccounts.trends.savings = calculateTrend(
    withAccounts.monthlySavings,
    previousSavings,
    "up"
  );
  
  return withAccounts;
}