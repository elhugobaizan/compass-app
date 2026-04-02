import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBill } from "@/services/bills";

export function useDeleteBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill_payments"] });
    },
  });
}