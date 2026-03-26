import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/services/settings";
import type { Setting } from "@/types/settings";

export function useSettingsQuery() {
  return useQuery<Setting[]>({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
}