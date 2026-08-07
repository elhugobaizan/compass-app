import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLocation, type CreateLocationInput } from "@/services/locations";

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationInput) => createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}
