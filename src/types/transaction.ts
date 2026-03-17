// src/types/transaction.ts
export type Transaction = {
  id: string;
  concept?: string | null;
  date: string;
  amount: string;
  account_id: string;
  category_id?: string | null;
  type_id: number;
  transfer_group?: string | null;
  location?: string | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};