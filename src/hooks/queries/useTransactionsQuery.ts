// src/hooks/queries/useTransactionsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/transactions";
import type { Transaction } from "@/types/transaction";

export function useTransactionsQuery() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
}