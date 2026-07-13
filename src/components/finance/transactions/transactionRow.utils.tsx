import { JSX } from "react";
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { TRANSACTION_TYPES } from "@/utils/transactionTypes";
import type { BadgeTone } from "../../ui/Badge";

export function getTransactionTone(typeLabel?: string): BadgeTone {
  if (typeLabel === TRANSACTION_TYPES.INGRESO) return "success";

  if (
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA ||
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA
  ) {
    return "info";
  }

  if (typeLabel === TRANSACTION_TYPES.AJUSTE) return "warning";

  return "neutral";
}

export function getTransactionDisplayLabel(typeLabel?: string): string {
  if (typeLabel === TRANSACTION_TYPES.INGRESO) return "Ingreso";

  if (
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA ||
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA
  ) {
    return "Transferencia";
  }

  if (typeLabel === TRANSACTION_TYPES.GASTO) return "Gasto";

  if (typeLabel === TRANSACTION_TYPES.AJUSTE) return "Ajuste";

  return "Movimiento";
}

export function getTransactionAmountClass(typeLabel?: string): string {
  if (typeLabel === TRANSACTION_TYPES.INGRESO) {
    return "text-[var(--color-income)]";
  }

  if (typeLabel === TRANSACTION_TYPES.GASTO) {
    return "text-[var(--color-expense)]";
  }

  if (
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA ||
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA
  ) {
    return "text-[var(--color-accent)]";
  }

  if (typeLabel === TRANSACTION_TYPES.AJUSTE) {
    return "text-[#8A5A2E]";
  }

  return "text-[var(--color-ink)]";
}

export function getTransactionAmountPrefix(typeLabel?: string): string {
  if (typeLabel === TRANSACTION_TYPES.INGRESO) return "+";
  if (typeLabel === TRANSACTION_TYPES.GASTO) return "-";

  if (
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA ||
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA
  ) {
    return "↔";
  }

  return "";
}

export function formatTransactionAmount(
  amount: string | number,
  typeLabel?: string,
): string {
  const prefix = getTransactionAmountPrefix(typeLabel);
  const n = typeof amount === "number" ? amount : Number(amount);

  if (!Number.isFinite(n)) {
    return prefix ? `${prefix} ${amount}` : String(amount);
  }

  // Con prefijo (+/-/↔) el signo lo da el prefijo → mostrar magnitud;
  // sin prefijo (ej. AJUSTE) se muestra el número con su propio signo.
  const value = prefix ? Math.abs(n) : n;
  const formatted = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return prefix ? `${prefix} ${formatted}` : formatted;
}

export function getTransactionIcon(typeLabel?: string): JSX.Element {
  if (typeLabel === TRANSACTION_TYPES.INGRESO) {
    return <ArrowDownLeft className="h-4 w-4 text-[var(--color-income)]" />;
  }

  if (typeLabel === TRANSACTION_TYPES.GASTO) {
    return <ArrowUpRight className="h-4 w-4 text-[var(--color-expense)]" />;
  }

  if (
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA ||
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA
  ) {
    return <ArrowRightLeft className="h-4 w-4 text-[var(--color-accent)]" />;
  }

  if (typeLabel === TRANSACTION_TYPES.AJUSTE) {
    return <SlidersHorizontal className="h-4 w-4 text-[#8A5A2E]" />;
  }

  return <ArrowUpRight className="h-4 w-4 text-[var(--color-ink)]" />;
}

export function getTransactionIconContainerClass(typeLabel?: string): string {
  if (typeLabel === TRANSACTION_TYPES.INGRESO) {
    return "bg-[var(--color-income-bg)]";
  }

  if (typeLabel === TRANSACTION_TYPES.AJUSTE) {
    return "bg-[#F6EAD5]";
  }

  if (typeLabel === TRANSACTION_TYPES.GASTO) {
    return "bg-[var(--color-expense-bg)]";
  }

  if (
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA ||
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA
  ) {
    return "bg-[var(--color-accent-bg)]";
  }

  return "bg-[var(--color-accent-bg)]";
}