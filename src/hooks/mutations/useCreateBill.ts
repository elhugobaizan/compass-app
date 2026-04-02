import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBill } from "@/services/bills";
import type { CreateBillInput } from "@/types/bill";

export function useCreateBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBillInput) => createBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill_payments"] });
    },
  });
}