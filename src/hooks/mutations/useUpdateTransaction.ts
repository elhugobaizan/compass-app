import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTransaction,
  type UpdateTransactionInput,
} from "@/services/transactions";

type UpdateTransactionArgs = {
  id: string;
  data: UpdateTransactionInput;
};

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTransactionArgs) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}