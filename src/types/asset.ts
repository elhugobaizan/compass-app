export type Asset = {
  id: string;
  account_id: string;
  name: string;
  symbol?: string | null;
  asset_type: string;
  quantity?: string | null;
  price?: string | null;
  capital?: string | null;
  interest?: string | null;
  start_date?: string | null;
  maturity?: string | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};