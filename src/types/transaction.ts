import { Account } from "./account";
import { Location } from "./location";

// src/types/transaction.ts
export type Transaction = {
  id: string;
  concept?: string | null;
  date: string;
  amount: number;
  account_id: string;
  category_id?: string | null;
  type_id: string | null;
  transfer_group?: string | null;
  location_id?: string | null;
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
  id: string;
  name: string;
};

export type TransactionCategory = {
  id: string;
  name: string;
  type: "INGRESO" | "GASTO" | "TRANSFERENCIA_ENTRADA" | "TRANSFERENCIA_SALIDA" | "AJUSTE";
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};