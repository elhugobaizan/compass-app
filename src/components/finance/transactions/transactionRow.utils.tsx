import { JSX } from "react";
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
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

  return "Movimiento";
}

export function getTransactionAmountClass(typeLabel?: string): string {
  if (typeLabel === TRANSACTION_TYPES.INGRESO) {
    return "text-green-600";
  }

  if (
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA ||
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA
  ) {
    return "text-blue-600";
  }

  return "text-gray-900";
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
  return prefix ? `${prefix} ${amount}` : String(amount);
}

export function getTransactionIcon(typeLabel?: string): JSX.Element {
  if (typeLabel === TRANSACTION_TYPES.INGRESO) {
    return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
  }

  if (
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA ||
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA
  ) {
    return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
  }

  return <ArrowUpRight className="h-4 w-4 text-gray-700" />;
}

export function getTransactionIconContainerClass(typeLabel?: string): string {
  if (typeLabel === TRANSACTION_TYPES.INGRESO) {
    return "bg-green-50";
  }

  if (
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA ||
    typeLabel === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA
  ) {
    return "bg-blue-50";
  }

  return "bg-gray-100";
}