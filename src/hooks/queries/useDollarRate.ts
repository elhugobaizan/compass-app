import { useQuery } from "@tanstack/react-query";
import { getRate, type RateQuote } from "@/services/rates";

/**
 * Cotización del dólar blue, para mostrarla en el chip del dashboard.
 * Para convertir montos usá `useExchangeRates`, que recorre el registro de monedas.
 */
export function useDollarRate() {
  return useQuery<RateQuote>({
    queryKey: ["rate", "USD"],
    queryFn: () => getRate("dolares/blue"),
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: 1,
  });
}
