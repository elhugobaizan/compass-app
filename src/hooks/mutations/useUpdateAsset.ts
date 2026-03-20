import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAsset,
  type UpdateAssetInput,
} from "@/services/assets";

type UpdateAssetArgs = {
  id: string;
  data: UpdateAssetInput;
};

export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateAssetArgs) =>
      updateAsset(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}