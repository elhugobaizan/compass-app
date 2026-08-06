export type DollarRate = {
  compra: number;
  venta: number;
  casa: string;
  nombre: string;
  fechaActualizacion: string;
};

const DOLAR_BLUE_URL = "https://dolarapi.com/v1/dolares/blue";
// La API solo publica el euro oficial (no hay "euro blue")
const EURO_URL = "https://dolarapi.com/v1/cotizaciones/eur";

export async function getDollarBlue(): Promise<DollarRate> {
  const res = await fetch(DOLAR_BLUE_URL);
  if (!res.ok) {
    throw new Error(`Error al obtener cotización del dólar: ${res.status}`);
  }
  return res.json();
}

export async function getEuroRate(): Promise<DollarRate> {
  const res = await fetch(EURO_URL);
  if (!res.ok) {
    throw new Error(`Error al obtener cotización del euro: ${res.status}`);
  }
  return res.json();
}
