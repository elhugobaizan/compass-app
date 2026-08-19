export type ShoppingItem = {
  id: string;
  name: string;
  is_done: boolean;
  /** Producto habitual: sobrevive al cierre de la compra. */
  is_recurring: boolean;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
