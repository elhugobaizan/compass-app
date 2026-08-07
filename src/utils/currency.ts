import { BASE_CURRENCY } from "@/config/currencies";

/** Cotización a la moneda base, por código de moneda. */
export type ExchangeRates = Record<string, number>;

/**
 * Convierte un monto a la moneda base (ARS) según la moneda de la cuenta.
 * Si no hay cotización disponible, devuelve el monto sin convertir.
 */
export function toArs(
  currency: string | null | undefined,
  amount: number,
  rates?: ExchangeRates,
): number {
  if (!currency || currency === BASE_CURRENCY) return amount;

  const rate = rates?.[currency];
  return rate && rate > 0 ? amount * rate : amount;
}

/**
 * Si hay cotización para convertir esa moneda a la base.
 * Sirve para no sumar en silencio montos que no se pudieron convertir.
 */
export function canConvert(
  currency: string | null | undefined,
  rates?: ExchangeRates,
): boolean {
  if (!currency || currency === BASE_CURRENCY) return true;

  const rate = rates?.[currency];
  return Boolean(rate && rate > 0);
}
