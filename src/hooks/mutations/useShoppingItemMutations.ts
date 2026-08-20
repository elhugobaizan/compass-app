import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  type CreateShoppingItemInput,
  type UpdateShoppingItemInput,
} from "@/services/shoppingItems";

const QUERY_KEY = ["shopping_items"];

export function useCreateShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShoppingItemInput) => createShoppingItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateShoppingItemInput }) =>
      updateShoppingItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteShoppingItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
