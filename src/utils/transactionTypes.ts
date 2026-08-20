export const TRANSACTION_TYPES = {
  GASTO: "GASTO",
  INGRESO: "INGRESO",
  TRANSFERENCIA_ENTRADA: "TRANSFERENCIA_ENTRADA",
  TRANSFERENCIA_SALIDA: "TRANSFERENCIA_SALIDA",
  AJUSTE: "AJUSTE",
  // Plata que entra o sale de una inversión: mueve el saldo de la cuenta,
  // pero no es ingreso ni gasto (la plata sigue siendo tuya).
  INVERSION_SALIDA: "INVERSION_SALIDA",
  INVERSION_ENTRADA: "INVERSION_ENTRADA",
} as const;

export type TransactionTypeFilterValue =
  | "all"
  | "INGRESO"
  | "GASTO"
  | "TRANSFERENCIA"
  | "INVERSION"
  | "AJUSTE";

export const TRANSACTION_TYPE_FILTERS: ReadonlyArray<{
  readonly label: string;
  readonly value: TransactionTypeFilterValue;
}> = [
  { label: "Todos", value: "all" },
  { label: "Ingresos", value: "INGRESO" },
  { label: "Gastos", value: "GASTO" },
  { label: "Transferencias", value: "TRANSFERENCIA" },
  { label: "Inversiones", value: "INVERSION" },
  { label: "Ajustes", value: "AJUSTE" },
];

// IDs de la tabla transaction_types (DB)
export const TRANSACTION_TYPE_IDS = {
  GASTO: 1,
  INGRESO: 2,
  TRANSFERENCIA_ENTRADA: 3,
  TRANSFERENCIA_SALIDA: 4,
  AJUSTE: 5,
  INVERSION_SALIDA: 6,
  INVERSION_ENTRADA: 7,
} as const;

export const transactionTypeLabels: Record<string, string> = {
  [TRANSACTION_TYPES.AJUSTE]: "AJUSTE",
  [TRANSACTION_TYPES.GASTO]: "GASTO",
  [TRANSACTION_TYPES.INGRESO]: "INGRESO",
  [TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA]: "TRANSFERENCIA_ENTRADA",
  [TRANSACTION_TYPES.TRANSFERENCIA_SALIDA]: "TRANSFERENCIA_SALIDA"
};