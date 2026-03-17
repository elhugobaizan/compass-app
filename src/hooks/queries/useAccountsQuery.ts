// src/hooks/queries/useAccountsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/services/accounts";
import type { Account } from "@/types/account";

export function useAccountsQuery() {
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
}