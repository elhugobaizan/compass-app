import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/services/assets";
import type { Asset } from "@/types/asset";

export function useAssetsQuery() {
  return useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: getAssets,
  });
}