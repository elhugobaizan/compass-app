import { useQuery } from "@tanstack/react-query";
import { getLocations } from "@/services/locations";
import type { Location } from "@/types/location";

export function useLocationsQuery() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: getLocations,
  });
}
