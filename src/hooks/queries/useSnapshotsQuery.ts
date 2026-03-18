import { useQuery } from "@tanstack/react-query";
import { getSnapshots, type Snapshot } from "@/services/snapshots";

export function useSnapshotsQuery() {
  return useQuery<Snapshot[]>({
    queryKey: ["snapshots"],
    queryFn: getSnapshots,
  });
}