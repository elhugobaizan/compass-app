import { useMemo } from "react";
import type { Asset } from "@/types/asset";
import { getAssetValue, getFixedDepositProjectedValue } from "@/utils/assets";
import { toNumber } from "@/utils/numbers";
import { formatCurrency } from "@/utils/formatters";

export function useAssetCard(asset: Asset) {
  return useMemo(() => {
    const value = getAssetValue(asset);
    const projectedValue = getFixedDepositProjectedValue(asset);
    const interest = toNumber(asset.interest);

    return {
      formattedValue: formatCurrency(value),
      formattedProjectedValue: projectedValue !== null ? formatCurrency(projectedValue) : null,
      formattedInterest: interest > 0 ? `${interest}% TNA` : null,
    };
  }, [asset]);
}
