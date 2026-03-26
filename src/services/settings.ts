import { apiFetch } from "./api";
import type { Setting } from "@/types/settings";

export function getSettings(): Promise<Setting[]> {
  return apiFetch<Setting[]>("/settings");
}