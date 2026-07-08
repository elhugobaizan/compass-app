import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import { TRANSACTION_TYPES } from "./transactionTypes";
import { toNumber } from "./numbers";

/**
 * Signo del movimiento según su tipo. El `amount` se guarda en positivo y
 * el signo lo determina el tipo de transacción.
 */
export function signedAmount(tx: Transaction): number {
  const amount = toNumber(tx.amount);

  switch (tx.type?.name) {
    case TRANSACTION_TYPES.INGRESO:
    case TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA:
      return amount;
    case TRANSACTION_TYPES.GASTO:
    case TRANSACTION_TYPES.TRANSFERENCIA_SALIDA:
      return -amount;
    case TRANSACTION_TYPES.AJUSTE:
      // Ajuste: se aplica tal cual (asume monto con su propio signo/positivo)
      return amount;
    default:
      return 0;
  }
}

/**
 * Momento de referencia del saldo inicial (timestamp). A partir de ese momento
 * el `opening_balance` se considera "la verdad", y solo los movimientos
 * estrictamente posteriores ajustan el saldo real.
 *
 * Se usa `date` del movimiento (fecha económica real) y no `created_at`, porque
 * este último refleja cuándo se insertó la fila (ej. importación en bloque) y no
 * cuándo ocurrió el movimiento. La comparación es por timestamp completo: un
 * movimiento con fecha del mismo día que el `updated_at` pero anterior en hora
 * (ej. el ingreso que fondeó la cuenta) queda incluido en el saldo inicial y no
 * se vuelve a sumar.
 */
function cutoffTime(account: Account): number | null {
  const ref = account.updated_at ?? account.opening_date ?? account.created_at;
  if (!ref) return null;
  const t = new Date(ref).getTime();
  return Number.isNaN(t) ? null : t;
}

function isAfterCutoff(txDate: string | null | undefined, cutoff: number | null): boolean {
  if (cutoff === null) return true;
  if (!txDate) return false;
  const t = new Date(txDate).getTime();
  return !Number.isNaN(t) && t > cutoff;
}

/**
 * Saldo real de una cuenta = saldo inicial (DB) + movimientos con fecha igual o
 * posterior a la fecha de referencia del saldo inicial.
 */
export function computeAccountBalance(
  account: Account,
  transactions: Transaction[] = [],
): number {
  const base = toNumber(account.opening_balance);
  const cutoff = cutoffTime(account);

  const net = transactions.reduce((sum, tx) => {
    if (tx.account_id !== account.id) return sum;
    if (tx.deleted_at) return sum;
    if (!isAfterCutoff(tx.date, cutoff)) return sum;

    return sum + signedAmount(tx);
  }, 0);

  return base + net;
}

/**
 * Movimientos que entran en el cálculo del saldo actual de una cuenta:
 * los de esa cuenta con fecha posterior a la referencia del saldo inicial.
 * Ordenados del más reciente al más antiguo.
 */
export function getAccountMovements(
  account: Account,
  transactions: Transaction[] = [],
): Transaction[] {
  const cutoff = cutoffTime(account);

  return transactions
    .filter(
      (tx) =>
        tx.account_id === account.id &&
        !tx.deleted_at &&
        isAfterCutoff(tx.date, cutoff),
    )
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

/**
 * Mapa id de cuenta → saldo real, recorriendo las transacciones una sola vez.
 */
export function buildAccountBalanceMap(
  accounts: Account[] = [],
  transactions: Transaction[] = [],
): Record<string, number> {
  const balances: Record<string, number> = {};
  const cutoffs: Record<string, number | null> = {};

  for (const account of accounts) {
    balances[account.id] = toNumber(account.opening_balance);
    cutoffs[account.id] = cutoffTime(account);
  }

  for (const tx of transactions) {
    if (tx.deleted_at) continue;
    if (!(tx.account_id in balances)) continue;
    if (!isAfterCutoff(tx.date, cutoffs[tx.account_id])) continue;

    balances[tx.account_id] += signedAmount(tx);
  }

  return balances;
}
