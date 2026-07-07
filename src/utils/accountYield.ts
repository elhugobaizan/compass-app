import type { Account } from "@/types/account";
import { toNumber } from "./numbers";

export type AccountYield = {
  account: Account;
  balance: number;
  rate: number;
  dailyYield: number;
  monthlyYield: number;
};

export function calculateAccountYield(account: Account): AccountYield | null {
  const rate = toNumber(account.interest_rate);

  if (rate <= 0) return null;

  const balance = toNumber(account.opening_balance);
  if (balance <= 0) return null;

  const dailyYield = (balance * rate) / 36500;
  const monthlyYield = (balance * rate) / 1200;

  return {
    account,
    balance,
    rate,
    dailyYield,
    monthlyYield,
  };
}

export function calculateTotalAccountYield(accounts: Account[]) {
  const yields = accounts
    .map(calculateAccountYield)
    .filter((y): y is AccountYield => y !== null);

  const totalDaily = yields.reduce((sum, y) => sum + y.dailyYield, 0);
  const totalMonthly = yields.reduce((sum, y) => sum + y.monthlyYield, 0);

  return {
    yields,
    totalDaily,
    totalMonthly,
  };
}
