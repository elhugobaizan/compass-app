/**
 * Los ids de la DB son enteros, pero los `<select>` del DOM sólo manejan strings.
 * El estado de los formularios se guarda como string (lo que el DOM necesita) y
 * se convierte a número recién al armar el payload, que es donde la API lo espera.
 *
 * Sin esto la comparación `"5" === 5` da false sin tirar error: falla en silencio.
 */

/** Id de entidad → string, para usar como `value` de un input o select. */
export function toIdValue(value: number | string | null | undefined): string {
  return value === null || value === undefined ? "" : String(value);
}

/** String del formulario → id numérico. Devuelve null si está vacío o no es válido. */
export function toId(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}
