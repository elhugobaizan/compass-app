import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import { ACCOUNT_GROUPS } from "./accountGroups";
import { toNumber } from "./numbers";

type SummaryKPIs = {
  netWorth: number;
  liquidity: number;
  debt: number;
  investments: number;
  monthlyIncome: number;
  monthlyExpenses: number;
};

function isSameMonth(dateString: string): boolean {
  const input = new Date(dateString);
  const now = new Date();

  return (
    input.getFullYear() === now.getFullYear() &&
    input.getMonth() === now.getMonth()
  );
}

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

  const withTransactions = transactions.reduce((acc, transaction) => {
    if (!isSameMonth(transaction.date)) return acc;

    const amount = toNumber(transaction.amount);

    if (transaction.type.name === "GASTO") {
      acc.monthlyExpenses += amount;
    }

    if (transaction.type.name === "INGRESO") {
      acc.monthlyIncome += amount;
    }

    return acc;
  }, withAccounts);

  return withTransactions;
}