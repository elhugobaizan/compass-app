export const transactionTypeLabels: Record<number, string> = {
  1: "EXPENSE",
  2: "INCOME",
  3: "TRANSFER",
};

export function getTransactionTypeLabel(typeId?: number): string | undefined {
  if (!typeId) return undefined;
  return transactionTypeLabels[typeId];
}