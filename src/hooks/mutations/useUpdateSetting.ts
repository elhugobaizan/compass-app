import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/services/api";

type UpdateSettingInput = {
  key: string;
  value: string | number | null;
};

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: UpdateSettingInput) => {
      return apiFetch(`/settings/${key}`, {
        method: "PATCH",
        body: JSON.stringify({ value }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
