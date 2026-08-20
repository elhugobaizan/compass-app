import { Account } from "./account";
import { Location } from "./location";

// src/types/transaction.ts
export type Transaction = {
  id: number;
  concept?: string | null;
  date: string;
  amount: number;
  account_id: number;
  category_id?: number | null;
  type_id: number | null;
  transfer_group?: string | null;
  location_id?: number | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;

  account: Account;
  /** Lugar asociado (relación con la tabla locations). */
  location_ref?: Location | null;
  category?: TransactionCategory | null;
  type: TransactionType;
};

export type TransactionType = {
  id: number;
  name: string;
};

export type TransactionCategory = {
  id: number;
  name: string;
  type: "INGRESO" | "GASTO" | "TRANSFERENCIA_ENTRADA" | "TRANSFERENCIA_SALIDA" | "AJUSTE";
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};