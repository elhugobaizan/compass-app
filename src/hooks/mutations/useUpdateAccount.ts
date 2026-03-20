import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAccount,
  type UpdateAccountInput,
} from "@/services/accounts";

type UpdateAccountArgs = {
  id: string;
  data: UpdateAccountInput;
};

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateAccountArgs) =>
      updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}