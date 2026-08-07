/**
 * Registro central de monedas.
 *
 * Para agregar una divisa nueva alcanza con sumar una línea acá: el selector de
 * cuentas, la cotización automática y la conversión a pesos la toman de esta lista.
 * `ratePath` es la ruta en dolarapi.com/v1/ (null = moneda base, no se convierte).
 */
export type CurrencyConfig = {
  readonly code: string;
  readonly label: string;
  readonly ratePath: string | null;
};

export const BASE_CURRENCY = "ARS";

export const CURRENCIES: readonly CurrencyConfig[] = [
  { code: "ARS", label: "ARS", ratePath: null },
  { code: "USD", label: "USD", ratePath: "dolares/blue" },
  { code: "EUR", label: "EUR", ratePath: "cotizaciones/eur" },
  // Ejemplos para sumar en el futuro (la API ya los publica):
  // { code: "BRL", label: "BRL", ratePath: "cotizaciones/brl" },
  // { code: "CLP", label: "CLP", ratePath: "cotizaciones/clp" },
  // { code: "UYU", label: "UYU", ratePath: "cotizaciones/uyu" },
];

/** Monedas que requieren cotización (todas menos la base). */
export const CONVERTIBLE_CURRENCIES = CURRENCIES.filter(
  (currency): currency is CurrencyConfig & { ratePath: string } =>
    currency.ratePath !== null,
);
