import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import { TRANSACTION_TYPES } from "./transactionTypes";

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function countTransactionsByAccount(
  transactions: Transaction[] = []
): Record<string, number> {
  return transactions.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.account_id] = (acc[tx.account_id] ?? 0) + 1;
    return acc;
  }, {});
}

/**
 * Cuentas remuneradas (TNA > 0) que no se reconcilian hace más de
 * `thresholdDays` días. La reconciliación es la más reciente entre:
 *  - el `updated_at` de la cuenta (última vez que se seteó el saldo inicial), y
 *  - la fecha del último movimiento de AJUSTE (ajuste de saldo real).
 * El interés se devenga estimado, así que conviene ajustar el saldo cada tanto.
 */
export function getStaleRemuneratedAccounts(
  accounts: Account[] = [],
  transactions: Transaction[] = [],
  thresholdDays = 30,
): Account[] {
  const now = Date.now();

  // fecha del último AJUSTE por cuenta
  const lastAdjustment: Record<string, number> = {};
  for (const tx of transactions) {
    if (tx.deleted_at) continue;
    if (tx.type?.name !== TRANSACTION_TYPES.AJUSTE) continue;
    const t = new Date(tx.date).getTime();
    if (Number.isNaN(t)) continue;
    if (!(tx.account_id in lastAdjustment) || t > lastAdjustment[tx.account_id]) {
      lastAdjustment[tx.account_id] = t;
    }
  }

  return accounts.filter((account) => {
    if (toNumber(account.interest_rate) <= 0) return false;

    const ref = account.updated_at ?? account.opening_date ?? account.created_at;
    let lastReconciled = ref ? new Date(ref).getTime() : 0;

    const adj = lastAdjustment[account.id];
    if (adj && adj > lastReconciled) lastReconciled = adj;

    if (!lastReconciled || Number.isNaN(lastReconciled)) return false;

    const days = Math.floor((now - lastReconciled) / 86_400_000);
    return days >= thresholdDays;
  });
}

export function getMostUsedAccounts(
  accounts: Account[] = [],
  transactions: Transaction[] = [],
  limit = 3
): Account[] {
  const txCountByAccount = countTransactionsByAccount(transactions);

  return [...accounts]
    .sort((a, b) => {
      const aUsage = txCountByAccount[a.id] ?? 0;
      const bUsage = txCountByAccount[b.id] ?? 0;

      if (aUsage !== bUsage) {
        return bUsage - aUsage;
      }

      return toNumber(b.opening_balance) - toNumber(a.opening_balance);
    })
    .slice(0, limit);
}