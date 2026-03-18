import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import { ACCOUNT_GROUPS } from "./accountGroups";
import { toNumber } from "./numbers";
import { isSameMonth, isPreviousMonth } from "./date";

export type SummaryKPIs = {
  netWorth: number;
  liquidity: number;
  debt: number;
  investments: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  trends: {
    income: Trend | undefined,
    expenses: Trend | undefined,
  }
};

type MonthlyComparison = {
  current: number;
  previous: number;
};

type Trend = {
  value: string;
  direction: "up" | "down" | "neutral";
};

export function calculateSummaryKPIs(
  accounts: Account[] = [],
  transactions: Transaction[] = []
): SummaryKPIs {
  const base = {
    netWorth: 0,
    liquidity: 0,
    debt: 0,
    investments: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    trends: {
      income: undefined as Trend | undefined,
      expenses: undefined as Trend | undefined,
    }
  };

  const withAccounts = accounts.reduce((acc, account) => {
    const balance = toNumber(account.opening_balance);

    acc.netWorth += balance;

    if (account.account_group.name === ACCOUNT_GROUPS.LIQUID) acc.liquidity += balance;
    if (account.account_group.name === ACCOUNT_GROUPS.INVESTMENT) acc.investments += balance;
    if (account.account_group.name === ACCOUNT_GROUPS.DEBT) acc.debt += balance;

    return acc;
  }, base);

  const income = calculateMonthlyAmounts(transactions, "INGRESO");
  const expenses = calculateMonthlyAmounts(transactions, "GASTO");

  withAccounts.monthlyExpenses = expenses.current;
  withAccounts.monthlyIncome =income.current;

  withAccounts.trends.income = calculateTrend(income.current, income.previous);
  withAccounts.trends.expenses = calculateTrend(expenses.current, expenses.previous);
  
  return withAccounts;
}

function calculateMonthlyAmounts(
  transactions: Transaction[],
  type: string
): MonthlyComparison {
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

function calculateTrend(current: number, previous: number): Trend | undefined {
  if (!previous) return undefined;

  const change = (current - previous) / previous;
  const percentage = Math.abs(change * 100).toFixed(0);

  if (change > 0) {
    return {
      value: `+${percentage}% vs mes anterior`,
      direction: "up",
    };
  }

  if (change < 0) {
    return {
      value: `-${percentage}% vs mes anterior`,
      direction: "down",
    };
  }

  return {
    value: "0% vs mes anterior",
    direction: "neutral",
  };
}