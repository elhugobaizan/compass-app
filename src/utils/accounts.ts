import type { Account } from "@/types/account";

export function getMostUsedAccounts(
  accounts: Account[],
  count: number = 3
): Account[] {
  return [...accounts]
    .slice(0, count);
}
