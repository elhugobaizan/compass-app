// src/types/account.ts
export type Account = {
  id: string;
  name: string;
  account_type: string;
  account_group_id: number;
  currency: string;
  institution?: string | null;
  identifier?: string | null;
  alias?: string | null;
  opening_balance?: string | null;
  opening_date?: string | null;
  interest_rate?: string | null;
  is_payment_method: boolean;
  logo?: string | null;
  display_order?: number | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};