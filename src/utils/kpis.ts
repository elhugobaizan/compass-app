import type { Account } from "@/types/account";
import { ACCOUNT_GROUPS } from "./accountGroups";
import { toNumber } from "./numbers";

type SummaryKPIs = {
  netWorth: number;
  liquidity: number;
  debt: number;
  investments: number;
};

export function calculateSummaryKPIs(accounts: Account[] = []): SummaryKPIs {
  return accounts.reduce(
    (acc, account) => {
      const balance = toNumber(account.opening_balance);

      acc.netWorth += balance;

      if (account.account_group_id === ACCOUNT_GROUPS.LIQUID) {
        acc.liquidity += balance;
      }

      if (account.account_group_id === ACCOUNT_GROUPS.INVESTMENT) {
        acc.investments += balance;
      }

      if (account.account_group_id === ACCOUNT_GROUPS.DEBT) {
        acc.debt += balance;
      }

      return acc;
    },
    {
      netWorth: 0,
      liquidity: 0,
      debt: 0,
      investments: 0,
    }
  );
}