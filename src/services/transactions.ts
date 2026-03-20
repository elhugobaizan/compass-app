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

export type UpdateTransactionInput = {
  concept?: string;
  amount: number;
  date: string;
  account_id: string;
  category_id?: string;
  type_id: string;
  location?: string;
};

type UpdateTransactionPayload = {
  concept?: string;
  amount: string;
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

function mapUpdateTransactionInput(
  input: UpdateTransactionInput
): UpdateTransactionPayload {
  return {
    concept: input.concept,
    amount: String(input.amount),
    date: input.date,
    account_id: input.account_id,
    category_id: input.category_id,
    type_id: input.type_id,
    location: input.location,
  };
}

export function updateTransaction(
  id: string,
  data: UpdateTransactionInput
): Promise<Transaction> {
  return apiFetch<Transaction>(`/transactions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(mapUpdateTransactionInput(data)),
  });
}