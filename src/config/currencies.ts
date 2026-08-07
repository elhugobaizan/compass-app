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
  /** Ruta en dolarapi.com/v1/ (null si esa API no publica la moneda). */
  readonly ratePath: string | null;
  /**
   * Para monedas que dolarapi no publica: se deriva cruzando por el dólar
   * (unidades por USD desde open.er-api) y valuando ese dólar al blue, para
   * mantener el mismo criterio que el resto.
   */
  readonly usdCross?: boolean;
};

export const BASE_CURRENCY = "ARS";

export const CURRENCIES: readonly CurrencyConfig[] = [
  { code: "ARS", label: "ARS", ratePath: null },
  { code: "USD", label: "USD", ratePath: "dolares/blue" },
  { code: "EUR", label: "EUR", ratePath: "cotizaciones/eur" },
  { code: "CLP", label: "CLP", ratePath: "cotizaciones/clp" },
  { code: "UYU", label: "UYU", ratePath: "cotizaciones/uyu" },
  // dolarapi no publica el sol peruano: se cruza por dólar
  { code: "PEN", label: "PEN", ratePath: null, usdCross: true },
  // Otra que publica dolarapi, por si hace falta:
  // { code: "BRL", label: "BRL", ratePath: "cotizaciones/brl" },
];

/** Monedas con cotización directa en dolarapi. */
export const CONVERTIBLE_CURRENCIES = CURRENCIES.filter(
  (currency): currency is CurrencyConfig & { ratePath: string } =>
    currency.ratePath !== null,
);

/** Monedas que se derivan cruzando por el dólar. */
export const CROSS_CURRENCIES = CURRENCIES.filter(
  (currency) => currency.usdCross === true,
);
