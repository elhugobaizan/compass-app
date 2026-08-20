import { apiFetch } from "./api";
import type { ShoppingItem } from "@/types/shoppingItem";

export type CreateShoppingItemInput = {
  name: string;
  is_done?: boolean;
  is_recurring?: boolean;
};

export type UpdateShoppingItemInput = Partial<CreateShoppingItemInput>;

export function getShoppingItems(): Promise<ShoppingItem[]> {
  return apiFetch<ShoppingItem[]>("/shopping_items", {
    query: { take: 500, orderBy: JSON.stringify({ created_at: "asc" }) },
  });
}

export function createShoppingItem(
  data: CreateShoppingItemInput,
): Promise<ShoppingItem> {
  return apiFetch<ShoppingItem>("/shopping_items", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateShoppingItem(
  id: number,
  data: UpdateShoppingItemInput,
): Promise<ShoppingItem> {
  return apiFetch<ShoppingItem>(`/shopping_items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteShoppingItem(id: number): Promise<{ success?: boolean }> {
  return apiFetch<{ success?: boolean }>(`/shopping_items/${id}`, {
    method: "DELETE",
  });
}
