import { useQuery } from "@tanstack/react-query";
import { getShoppingItems } from "@/services/shoppingItems";
import type { ShoppingItem } from "@/types/shoppingItem";

export function useShoppingItemsQuery() {
  return useQuery<ShoppingItem[]>({
    queryKey: ["shopping_items"],
    queryFn: getShoppingItems,
  });
}
