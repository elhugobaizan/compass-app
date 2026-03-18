export const transactionTypeLabels: Record<string, string> = {
  "Gasto": "GASTO",
  "Ingreso": "INGRESO",
  "Tx_ent": "TRANSFERENCIA_ENTRADA",
  "Tx_sal": "TRANSFERENCIA_SALIDA",
  "Ajuste": "AJUSTE"
};

export function getTransactionTypeLabel(typeId?: number): string | undefined {
  if (!typeId) return undefined;
  return transactionTypeLabels[typeId];
}