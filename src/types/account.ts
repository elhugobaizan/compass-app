// src/types/account.ts
export type Account = {
  id: string;
  name: string;
  account_type: string;
  account_group_id: string;
  account_group: AccountGroup;
  currency: string;
  institution?: string | null;
  identifier?: string | null;
  alias?: string | null;
  opening_balance?: number | null;
  opening_date?: string | null;
  interest_rate?: string | null;
  is_payment_method: boolean;
  logo?: string | null;
  display_order?: number | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type AccountGroup = {
  id: number;
  name: string;
}

export type AccountType = "BANK" | "WALLET" | "BROKER";

export type AccountTypeFilterValue = "all" | "BANK" | "WALLET" | "BROKER";

export const ACCOUNT_TYPE_FILTERS: ReadonlyArray<{
  readonly label: string;
  readonly value: AccountTypeFilterValue;
}> = [
    { label: "Todas", value: "all" },
    { label: "Bancos", value: "BANK" },
    { label: "Wallets", value: "WALLET" },
    { label: "Brokers", value: "BROKER" },
  ];