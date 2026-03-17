// src/services/accounts.ts
import { apiFetch } from "./api";
import type { Account } from "@/types/account";

export function getAccounts(): Promise<Account[]> {
  return apiFetch<Account[]>("/accounts");
}

export function getAccountById(id: string): Promise<Account> {
  return apiFetch<Account>(`/accounts/${id}`);
}