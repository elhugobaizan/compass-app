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
