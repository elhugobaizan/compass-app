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
