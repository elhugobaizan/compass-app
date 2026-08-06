import { useQuery } from "@tanstack/react-query";
import { getDollarBlue, getEuroRate, type DollarRate } from "@/services/dollar";

export function useDollarRate() {
  return useQuery<DollarRate>({
    queryKey: ["dollar", "blue"],
    queryFn: getDollarBlue,
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: 1,
  });
}

export function useEuroRate() {
  return useQuery<DollarRate>({
    queryKey: ["euro", "oficial"],
    queryFn: getEuroRate,
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: 1,
  });
}

/** Cotizaciones a ARS (promedio compra/venta) por moneda. */
export function useExchangeRates(): { usd?: number; eur?: number } {
  const { data: dollar } = useDollarRate();
  const { data: euro } = useEuroRate();

  return {
    usd: dollar ? (dollar.compra + dollar.venta) / 2 : undefined,
    eur: euro ? (euro.compra + euro.venta) / 2 : undefined,
  };
}
