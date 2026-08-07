import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLocation, type UpdateLocationInput } from "@/services/locations";

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocationInput }) =>
      updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
