import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSnapshot, type CreateSnapshotInput } from "@/services/snapshots";

export function useCreateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSnapshotInput) => createSnapshot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}
