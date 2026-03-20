// src/services/accounts.ts
import { apiFetch } from "./api";
import type { Account } from "@/types/account";

type AccountInput = Pick<Account,
  'name' | 'account_type' | 'account_group_id' | 'currency' | 'institution' | 'opening_balance' | 'opening_date' | 'is_payment_method'
>;

export type CreateAccountInput = AccountInput;
export type UpdateAccountInput = AccountInput;


export function getAccounts(): Promise<Account[]> {
  return apiFetch<Account[]>("/accounts");
}

export function getAccountById(id: string): Promise<Account> {
  return apiFetch<Account>(`/accounts/${id}`);
}

export function createAccount(
  data: CreateAccountInput
): Promise<Account> {
  return apiFetch<Account>("/accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteAccount(id: string): Promise<{ success?: boolean }> {
  return apiFetch<{ success?: boolean }>(`/accounts/${id}`, {
    method: "DELETE",
  });
}

export function updateAccount(
  id: string,
  data: UpdateAccountInput
): Promise<Account> {
  return apiFetch<Account>(`/accounts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}