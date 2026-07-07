import type { Asset } from "@/types/asset";
import { toNumber } from "./numbers";
import { getAssetValue } from "./assets";

export type AssetYield = {
  asset: Asset;
  value: number;
  tna: number;
  dailyYield: number;
  monthlyYield: number;
};

export function calculateAssetYield(asset: Asset): AssetYield | null {
  const tna = toNumber(asset.interest);

  if (tna <= 0) return null;

  const value = getAssetValue(asset);
  if (value <= 0) return null;

  const dailyYield = (value * tna) / 36500;
  const monthlyYield = (value * tna) / 1200;

  return {
    asset,
    value,
    tna,
    dailyYield,
    monthlyYield,
  };
}

export function calculateTotalYield(assets: Asset[]) {
  const yields = assets
    .map(calculateAssetYield)
    .filter((y): y is AssetYield => y !== null);

  const totalDaily = yields.reduce((sum, y) => sum + y.dailyYield, 0);
  const totalMonthly = yields.reduce((sum, y) => sum + y.monthlyYield, 0);

  return {
    yields,
    totalDaily,
    totalMonthly,
  };
}
