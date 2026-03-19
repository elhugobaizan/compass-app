import { apiFetch } from "./api";
import type { Asset } from "@/types/asset";

export type CreateAssetInput = {
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

type CreateAssetPayload = {
  account_id: string;
  name: string;
  symbol?: string;
  asset_type: string;
  quantity?: string;
  price?: string;
  capital?: string;
  interest?: string;
  start_date?: string;
  maturity?: string;
};

function mapCreateAssetInput(input: CreateAssetInput): CreateAssetPayload {
  return {
    account_id: input.account_id,
    name: input.name,
    symbol: input.symbol || undefined,
    asset_type: input.asset_type,
    quantity: input.quantity ? String(input.quantity) : undefined,
    price: input.price ? String(input.price) : undefined,
    capital: input.capital ? String(input.capital) : undefined,
    interest: input.interest ? String(input.interest) : undefined,
    start_date: input.start_date || undefined,
    maturity: input.maturity || undefined,
  };
}

export function getAssets(): Promise<Asset[]> {
  return apiFetch<Asset[]>("/assets");
}

export function createAsset(data: CreateAssetInput): Promise<Asset> {
  return apiFetch<Asset>("/assets", {
    method: "POST",
    body: JSON.stringify(mapCreateAssetInput(data)),
  });
}