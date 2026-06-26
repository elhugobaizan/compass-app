import type { Asset } from "@/types/asset";
import { toNumber } from "@/utils/numbers";
import { getDaysFromToday, parseLocalDate } from "./date";

export function getAssetValue(asset: Asset): number {
  const quantity = toNumber(asset.quantity);
  const price = toNumber(asset.price);
  const capital = toNumber(asset.capital);

  if (quantity > 0 && price > 0) return quantity * price;
  if (capital > 0) return capital;
  if (price > 0) return price;

  return 0;
}

export function getTotalAssetsValue(assets: Asset[] = []): number {
  return assets.reduce((sum, asset) => sum + getAssetValue(asset), 0);
}

function getAssetPriority(asset: Asset): number {
  const daysToMaturity = getDaysFromToday(asset.maturity);

  if (daysToMaturity === 0) return 0;
  if (daysToMaturity !== null && daysToMaturity > 0) return 1;
  return 2;
}

function isNonEmptyDateString(value: string | null | undefined): value is string {
  return value != null && value.trim().length > 0;
}

function compareAssetDates(
  left?: string | null,
  right?: string | null,
): number {
  if (!isNonEmptyDateString(left) && !isNonEmptyDateString(right)) return 0;
  if (!isNonEmptyDateString(left)) return 1;
  if (!isNonEmptyDateString(right)) return -1;

  const leftDate = parseLocalDate(left);
  const rightDate = parseLocalDate(right);

  return leftDate.getTime() - rightDate.getTime();
}

export function sortAssetsByPriority(assets: Asset[] = []): Asset[] {
  return [...assets].sort((a, b) => {
    const priorityDiff = getAssetPriority(a) - getAssetPriority(b);
    if (priorityDiff !== 0) return priorityDiff;

    const dateDiff = compareAssetDates(a.maturity, b.maturity);
    if (dateDiff !== 0) return dateDiff;

    return a.name.localeCompare(b.name);
  });
}


export function getFixedDepositProjectedValue(asset: Asset): number | null {
  const capital = toNumber(asset.capital);
  const interest = toNumber(asset.interest);

  if (capital <= 0 || interest <= 0 || !asset.start_date || !asset.maturity) return null;

  const start = parseLocalDate(asset.start_date);
  const end = parseLocalDate(asset.maturity);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);

  if (days <= 0) return null;

  return capital * (1 + (interest / 100) * (days / 365));
}

export function getAssetsDueInNextDays(assets: Asset[], days: number): number {
  return assets.filter((asset) => {
    const diff = getDaysFromToday(asset.maturity);
    return diff !== null && diff >= 0 && diff <= days;
  }).length;
}