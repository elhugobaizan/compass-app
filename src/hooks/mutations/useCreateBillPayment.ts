import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBillPayment } from "@/services/bills";
import { CreateBillPaymentInput } from "@/types/bill";

export function useCreateBillPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBillPaymentInput) => createBillPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill-payments"] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}