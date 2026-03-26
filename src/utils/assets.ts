import type { Asset } from "@/types/asset";
import { toNumber } from "@/utils/numbers";

export function getAssetValue(asset: Asset): number {
  const quantity = toNumber(asset.quantity);
  const price = toNumber(asset.price);
  const capital = toNumber(asset.capital);

  if ((asset.asset_type === "CRYPTO" || asset.asset_type === "STOCK") && quantity > 0 && price > 0) {
    return quantity * price;
  }

  if (asset.asset_type === "FIXED_DEPOSIT" && capital > 0) {
    return capital;
  }

  if (capital > 0) {
    return capital;
  }

  if (price > 0) {
    return price;
  }

  return 0;
}

export function getTotalAssetsValue(assets: Asset[] = []): number {
  return assets.reduce((sum, asset) => sum + getAssetValue(asset), 0);
}