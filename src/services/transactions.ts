// src/services/transactions.ts
import { apiFetch } from "./api";
import type { Transaction } from "@/types/transaction";

export type CreateTransactionInput = {
  concept?: string;
  amount: number;
  date: string;
  account_id: string;
  category_id?: string;
  type_id: string;
  location?: string;
};

export function getTransactions(): Promise<Transaction[]> {
  return apiFetch<Transaction[]>("/transactions");
}

export function createTransaction(
  data: CreateTransactionInput
): Promise<Transaction> {
  return apiFetch<Transaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteTransaction(id: string): Promise<{ success?: boolean }> {
  return apiFetch<{ success?: boolean }>(`/transactions/${id}`, {
    method: "DELETE",
  });
}