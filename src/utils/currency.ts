export type ExchangeRates = {
  usd?: number;
  eur?: number;
};

/**
 * Convierte un monto a ARS según la moneda de la cuenta.
 * Si no hay cotización disponible para esa moneda, devuelve el monto sin convertir.
 */
export function toArs(
  currency: string | null | undefined,
  amount: number,
  rates?: ExchangeRates,
): number {
  if (!rates) return amount;

  if (currency === "USD" && rates.usd && rates.usd > 0) {
    return amount * rates.usd;
  }

  if (currency === "EUR" && rates.eur && rates.eur > 0) {
    return amount * rates.eur;
  }

  return amount;
}
