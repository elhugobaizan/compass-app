export type ShoppingItem = {
  id: string;
  name: string;
  quantity?: string | null;
  is_done: boolean;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
