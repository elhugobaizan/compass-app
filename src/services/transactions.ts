// src/services/transactions.ts
import { apiFetch } from "./api";
import type { Transaction } from "@/types/transaction";

type TransactionInput = Pick<Transaction,
  'concept' | 'amount' | 'date' | 'account_id' | 'category_id' | 'type_id' | 'location'>;
// Despues deberia ser Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

export type CreateTransactionInput = TransactionInput;

export type UpdateTransactionInput = TransactionInput

type UpdateTransactionPayload = TransactionInput

export type GetTransactionsParams = {
  from?: string;
  to?: string;
  take?: number;
  orderBy?: Record<string, "asc" | "desc">;
};

export function getTransactions(
  params: GetTransactionsParams = {}
): Promise<Transaction[]> {
  const query: Record<string, string | number> = {};

  if (params.from || params.to) {
    const date: { gte?: string; lt?: string } = {};
    if (params.from) date.gte = params.from;
    if (params.to) date.lt = params.to;
    query.filter = JSON.stringify({ date });
  }

  if (params.orderBy) {
    query.orderBy = JSON.stringify(params.orderBy);
  }

  if (params.take != null) {
    query.take = params.take;
  }

  return apiFetch<Transaction[]>("/transactions", { query });
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
    amount: input.amount,
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