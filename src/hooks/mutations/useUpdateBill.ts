import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateBill,
} from "@/services/bills";
import type { UpdateBillInput } from "@/types/bill";

type UpdateBillArgs = {
  id: string;
  data: UpdateBillInput;
};

export function useUpdateBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateBillArgs) =>
      updateBill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}