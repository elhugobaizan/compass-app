import type { Asset } from "@/types/asset";
import type { Account } from "@/types/account";
import { toNumber } from "./numbers";
import { getAssetValue, getAssetCurrency } from "./assets";
import { toArs, type ExchangeRates } from "./currency";

export type AssetYield = {
  asset: Asset;
  value: number;
  tna: number;
  dailyYield: number;
  monthlyYield: number;
  /** Moneda del activo (heredada de su cuenta). */
  currency: string;
};

export function calculateAssetYield(
  asset: Asset,
  accounts: Account[] = [],
): AssetYield | null {
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
    currency: getAssetCurrency(asset, accounts),
  };
}

/** Los totales se convierten a pesos; cada activo conserva su moneda. */
export function calculateTotalYield(
  assets: Asset[],
  accounts: Account[] = [],
  rates?: ExchangeRates,
) {
  const yields = assets
    .map((asset) => calculateAssetYield(asset, accounts))
    .filter((y): y is AssetYield => y !== null);

  const totalDaily = yields.reduce(
    (sum, y) => sum + toArs(y.currency, y.dailyYield, rates),
    0,
  );
  const totalMonthly = yields.reduce(
    (sum, y) => sum + toArs(y.currency, y.monthlyYield, rates),
    0,
  );

  return {
    yields,
    totalDaily,
    totalMonthly,
  };
}
