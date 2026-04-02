import { useQuery } from "@tanstack/react-query";
import { getBills } from "@/services/bills";

export function useBillsQuery() {
  return useQuery({
    queryKey: ["bills"],
    queryFn: getBills,
  });
}