import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function countTransactionsByAccount(
  transactions: Transaction[] = []
): Record<string, number> {
  return transactions.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.account_id] = (acc[tx.account_id] ?? 0) + 1;
    return acc;
  }, {});
}

export function getMostUsedAccounts(
  accounts: Account[] = [],
  transactions: Transaction[] = [],
  limit = 3
): Account[] {
  const txCountByAccount = countTransactionsByAccount(transactions);

  return [...accounts]
    .sort((a, b) => {
      const aUsage = txCountByAccount[a.id] ?? 0;
      const bUsage = txCountByAccount[b.id] ?? 0;

      if (aUsage !== bUsage) {
        return bUsage - aUsage;
      }

      return toNumber(b.opening_balance) - toNumber(a.opening_balance);
    })
    .slice(0, limit);
}