export type DollarRate = {
  compra: number;
  venta: number;
  casa: string;
  nombre: string;
  fechaActualizacion: string;
};

const DOLAR_BLUE_URL = "https://dolarapi.com/v1/dolares/blue";

export async function getDollarBlue(): Promise<DollarRate> {
  const res = await fetch(DOLAR_BLUE_URL);
  if (!res.ok) {
    throw new Error(`Error al obtener cotización del dólar: ${res.status}`);
  }
  return res.json();
}
