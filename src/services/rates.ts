export type RateQuote = {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
};

const BASE_URL = "https://dolarapi.com/v1/";

/** Trae una cotización por su ruta (ej. "dolares/blue", "cotizaciones/eur"). */
export async function getRate(path: string): Promise<RateQuote> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Error al obtener la cotización (${path}): ${res.status}`);
  }
  return res.json();
}

const USD_CROSS_URL = "https://open.er-api.com/v6/latest/USD";

/**
 * Unidades de cada moneda por 1 USD (ej. PEN: 3.38).
 * Se usa para las monedas que dolarapi no publica: cruzando por el dólar y
 * valuando ese dólar al blue, se mantiene el criterio del resto de la app.
 */
export async function getUsdCrossRates(): Promise<Record<string, number>> {
  const res = await fetch(USD_CROSS_URL);
  if (!res.ok) {
    throw new Error(`Error al obtener cotizaciones cruzadas: ${res.status}`);
  }

  const data = await res.json();
  if (data?.result !== "success" || !data?.rates) {
    throw new Error("Respuesta inválida de cotizaciones cruzadas");
  }

  return data.rates as Record<string, number>;
}
