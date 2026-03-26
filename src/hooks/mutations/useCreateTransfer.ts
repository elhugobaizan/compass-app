import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTransfer,
  type CreateTransferInput,
} from "@/services/transfers";

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransferInput) => createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}