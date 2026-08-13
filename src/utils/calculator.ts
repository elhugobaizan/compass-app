/**
 * Evalúa una expresión simple de sumas y restas (ej. "1200+800-500").
 * Parser propio, sin `eval`: solo acepta dígitos, separador decimal, + y -.
 * Devuelve null si la expresión es inválida o está incompleta.
 */
export function evaluateExpression(input: string): number | null {
  const text = (input ?? "").replace(/\s/g, "").replace(/,/g, ".");
  if (text === "") return null;

  // Solo caracteres permitidos
  if (!/^[\d.+-]+$/.test(text)) return null;

  // Tokeniza en números con su signo
  const tokens = text.match(/[+-]?(\d+\.?\d*|\.\d+)/g);
  if (!tokens) return null;

  // Si al reconstruir no coincide, había algo mal (ej. "1++2" o "1+")
  if (tokens.join("") !== text) return null;

  let total = 0;
  for (const token of tokens) {
    const value = Number(token);
    if (!Number.isFinite(value)) return null;
    total += value;
  }

  return total;
}

/** Si el texto es una operación (tiene + o - entre números) y no un número suelto. */
export function isExpression(input: string): boolean {
  const text = (input ?? "").replace(/\s/g, "");
  return /\d[+-]/.test(text);
}
