import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLocation } from "@/services/locations";

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
