import { apiFetch } from "./api";

export type Snapshot = {
  id: string;
  year: number;
  month: number;
  period?: string | null;
  net_worth_ars?: string | null;
  net_worth_usd?: string | null;
  liquidity?: string | null;
  investments?: string | null;
  debt?: string | null;
  exchange_rate?: string | null;
  created_at: string;
};

export function getSnapshots(): Promise<Snapshot[]> {
  return apiFetch<Snapshot[]>("/snapshots");
}

export type CreateSnapshotInput = {
  year: number;
  month: number;
  period?: string | null;
  net_worth_ars?: number | null;
  net_worth_usd?: number | null;
  liquidity?: number | null;
  investments?: number | null;
  debt?: number | null;
  exchange_rate?: number | null;
};

export function createSnapshot(data: CreateSnapshotInput): Promise<Snapshot> {
  return apiFetch<Snapshot>("/snapshots", {
    method: "POST",
    body: JSON.stringify(data),
  });
}