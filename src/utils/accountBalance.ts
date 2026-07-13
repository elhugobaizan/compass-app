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

const DAY_MS = 86_400_000;

function toDayNumber(value: string | number): number {
  const key = new Date(value).toISOString().slice(0, 10);
  return Math.floor(new Date(`${key}T00:00:00.000Z`).getTime() / DAY_MS);
}

export type AccountBalanceBreakdown = {
  /** Saldo inicial (opening_balance de la DB). */
  readonly openingBalance: number;
  /** Neto de los movimientos posteriores a la fecha de referencia. */
  readonly movementsNet: number;
  /** Interés devengado (cuentas remuneradas), 0 si no aplica. */
  readonly accruedInterest: number;
  /** Días de interés devengados desde la fecha de referencia. */
  readonly interestDays: number;
  /** Saldo actual = inicial + movimientos + interés devengado. */
  readonly balance: number;
};

/**
 * Desglose del saldo real de una cuenta:
 *  saldo inicial (DB) + movimientos posteriores a la fecha de referencia
 *  + interés devengado (cuentas remuneradas, compuesto diario simulando día a día).
 */
export function computeAccountBreakdown(
  account: Account,
  transactions: Transaction[] = [],
  asOf: Date = new Date(),
): AccountBalanceBreakdown {
  const base = toNumber(account.opening_balance);
  const cutoff = cutoffTime(account);
  const rate = toNumber(account.interest_rate);

  const movements = transactions.filter(
    (tx) =>
      tx.account_id === account.id &&
      !tx.deleted_at &&
      isAfterCutoff(tx.date, cutoff),
  );
  const movementsNet = movements.reduce((sum, tx) => sum + signedAmount(tx), 0);

  // Sin tasa o sin fecha de referencia → solo saldo inicial + movimientos
  if (!(rate > 0) || cutoff === null) {
    return {
      openingBalance: base,
      movementsNet,
      accruedInterest: 0,
      interestDays: 0,
      balance: base + movementsNet,
    };
  }

  // Simulación día a día con capitalización diaria
  const dailyRate = rate / 36500; // TNA (%) → tasa diaria
  const startDay = toDayNumber(cutoff);
  const todayDay = toDayNumber(asOf.getTime());
  const interestDays = Math.max(0, todayDay - startDay);

  // Movimientos agrupados por día (número de día); los futuros se suman al final
  const movByDay = new Map<number, number>();
  let futureNet = 0;
  for (const tx of movements) {
    const day = toDayNumber(tx.date);
    const amount = signedAmount(tx);
    if (day > todayDay) {
      futureNet += amount;
    } else {
      movByDay.set(day, (movByDay.get(day) ?? 0) + amount);
    }
  }

  let balance = base;
  for (let i = 1; i <= interestDays; i++) {
    balance *= 1 + dailyRate;
    const dayMovements = movByDay.get(startDay + i);
    if (dayMovements) balance += dayMovements;
  }
  balance += futureNet;

  const accruedInterest = balance - base - movementsNet;

  return {
    openingBalance: base,
    movementsNet,
    accruedInterest,
    interestDays,
    balance,
  };
}

/**
 * Saldo real de una cuenta = saldo inicial + movimientos + interés devengado.
 */
export function computeAccountBalance(
  account: Account,
  transactions: Transaction[] = [],
): number {
  return computeAccountBreakdown(account, transactions).balance;
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
 * Mapa id de cuenta → saldo real (inicial + movimientos + interés devengado).
 */
export function buildAccountBalanceMap(
  accounts: Account[] = [],
  transactions: Transaction[] = [],
): Record<string, number> {
  const balances: Record<string, number> = {};

  for (const account of accounts) {
    balances[account.id] = computeAccountBreakdown(account, transactions).balance;
  }

  return balances;
}
