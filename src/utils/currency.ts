/**
 * Convierte un monto a ARS según la moneda de la cuenta.
 * Hoy solo se convierte USD (con la cotización provista); el resto se deja igual.
 */
export function toArs(
  currency: string | null | undefined,
  amount: number,
  usdRate?: number,
): number {
  if (currency === "USD" && usdRate && usdRate > 0) {
    return amount * usdRate;
  }
  return amount;
}
