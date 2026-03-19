import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsset, type CreateAssetInput } from "@/services/assets";

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssetInput) => createAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}