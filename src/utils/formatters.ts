import { parseLocalDate } from "./date";

export function formatCurrency(value: number, currency = "ARS"): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatRelativeDate(value: string): string {
  const input = parseLocalDate(value);
  const today = new Date();

  const inputDate = new Date(
    input.getFullYear(),
    input.getMonth(),
    input.getDate()
  );

  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const diffMs = todayDate.getTime() - inputDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(input);
}