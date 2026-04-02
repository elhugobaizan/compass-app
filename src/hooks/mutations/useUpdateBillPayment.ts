import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateBillPayment,
} from "@/services/bills";
import type { UpdateBillPaymentInput } from "@/types/bill";

type UpdateBillPaymentArgs = {
  id: string;
  data: UpdateBillPaymentInput;
};

export function useUpdateBillPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateBillPaymentArgs) =>
      updateBillPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill-payments"] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
}