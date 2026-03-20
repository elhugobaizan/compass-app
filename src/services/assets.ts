import { apiFetch } from "./api";
import type { Asset } from "@/types/asset";

type AssetInput = {
  account_id: string;
  name: string;
  symbol?: string;
  asset_type: string;
  quantity?: number;
  price?: number;
  capital?: number;
  interest?: number;
  start_date?: string;
  maturity?: string;
};

export type CreateAssetInput = AssetInput;
export type UpdateAssetInput = AssetInput;

export function getAssets(): Promise<Asset[]> {
  return apiFetch<Asset[]>("/assets");
}

export function createAsset(data: CreateAssetInput): Promise<Asset> {
  return apiFetch<Asset>("/assets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteAsset(id: string): Promise<{ success?: boolean }> {
  return apiFetch<{ success?: boolean }>(`/assets/${id}`, {
    method: "DELETE",
  });
}

export function updateAsset(
  id: string,
  data: UpdateAssetInput
): Promise<Asset> {
  return apiFetch<Asset>(`/assets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}