import { useQuery } from "@tanstack/react-query";
import { getDollarBlue, type DollarRate } from "@/services/dollar";

export function useDollarRate() {
  return useQuery<DollarRate>({
    queryKey: ["dollar", "blue"],
    queryFn: getDollarBlue,
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: 1,
  });
}
