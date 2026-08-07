import { useQueries } from "@tanstack/react-query";

import { getRate, type RateQuote } from "@/services/rates";
import {
  BASE_CURRENCY,
  CONVERTIBLE_CURRENCIES,
} from "@/config/currencies";
import type { ExchangeRates } from "@/utils/currency";

const ONE_HOUR = 1000 * 60 * 60;

/**
 * Cotizaciones a la moneda base, por código de moneda (promedio compra/venta).
 * Recorre el registro de monedas, así que agregar una divisa no requiere tocar esto.
 */
export function useExchangeRates(): ExchangeRates {
  const results = useQueries({
    queries: CONVERTIBLE_CURRENCIES.map((currency) => ({
      queryKey: ["rate", currency.code],
      queryFn: () => getRate(currency.ratePath),
      staleTime: ONE_HOUR,
      retry: 1,
    })),
  });

  const rates: ExchangeRates = { [BASE_CURRENCY]: 1 };

  CONVERTIBLE_CURRENCIES.forEach((currency, index) => {
    const quote = results[index]?.data as RateQuote | undefined;
    if (quote) {
      rates[currency.code] = (quote.compra + quote.venta) / 2;
    }
  });

  return rates;
}
