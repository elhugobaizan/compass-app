// src/services/accounts.ts
import { apiFetch } from "./api";
import type { Account } from "@/types/account";

export type CreateAccountInput = {
  name: string;
  account_type: string;
  account_group_id: string;
  currency: string;
  institution?: string;
  opening_balance?: number;
  opening_date?: string;
  is_payment_method?: boolean;
};

type CreateAccountPayload = {
  name: string;
  account_type: string;
  account_group_id: string;
  currency: string;
  institution?: string;
  opening_balance?: string;
  opening_date?: string;
  is_payment_method?: boolean;
};

function mapCreateAccountInput(
  input: CreateAccountInput
): CreateAccountPayload {
  return {
    name: input.name,
    account_type: input.account_type,
    account_group_id: input.account_group_id,
    currency: input.currency,
    institution: input.institution || undefined,
    opening_balance:
      input.opening_balance 
        ? String(input.opening_balance)
        : undefined,
    opening_date: input.opening_date + "T00:00:00.000Z" || undefined,
    is_payment_method: input.is_payment_method ?? false,
  };
}

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
    body: JSON.stringify(mapCreateAccountInput(data)),
  });
}