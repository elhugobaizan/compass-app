import type { Transaction } from "@/types/transaction";
import type { Asset } from "@/types/asset";
import type { Bill, BillPayment } from "@/types/bill";
import { TRANSACTION_TYPES } from "./transactionTypes";
import { toNumber } from "./numbers";
import {
  getDaysFromToday,
  isTodayDateString,
  pad2,
  toDateKey,
  getTodayKey,
} from "./date";

export type NextDue = {
  readonly label: string;
  readonly dateKey: string;
  readonly daysFromToday: number;
} | null;

export type MonthlyHighlights = {
  readonly dailyMax: number;
  readonly daysRemaining: number;
  readonly spentToday: number;
  readonly pendingFixedExpenses: number;
  readonly nextFixedDeposit: NextDue;
  readonly nextBill: NextDue;
};

function daysRemainingInMonth(now: Date): number {
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate() + 1;
}

export function getSpentToday(transactions: Transaction[] = []): number {
  return transactions.reduce((sum, tx) => {
    if (tx.type?.name !== TRANSACTION_TYPES.GASTO) return sum;
    if (!isTodayDateString(tx.date)) return sum;
    return sum + toNumber(tx.amount);
  }, 0);
}

function isBillPaid(payment: BillPayment | undefined): boolean {
  return Boolean(payment && (payment.status === "paid" || payment.paid_at));
}

function getBillDueKey(
  bill: Bill,
  payment: BillPayment | undefined,
  year: number,
  month: number,
): string | null {
  const fromPayment = toDateKey(payment?.due_date);
  if (fromPayment) return fromPayment;
  if (bill.due_day) return `${year}-${pad2(month)}-${pad2(bill.due_day)}`;
  return null;
}

export function getPendingBills(
  bills: Bill[] = [],
  billPayments: BillPayment[] = [],
): { pendingTotal: number; nextBill: NextDue } {
  const paymentByBillId = new Map(billPayments.map((p) => [p.bill_id, p]));
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const todayKey = getTodayKey() ?? "";

  let pendingTotal = 0;
  let nextBill: NextDue = null;

  for (const bill of bills) {
    if (bill.deleted_at != null || bill.is_active === false) continue;

    const payment = paymentByBillId.get(bill.id);
    if (isBillPaid(payment)) continue;

    const expected =
      toNumber(payment?.expected_amount) || toNumber(bill.default_amount);
    pendingTotal += expected;

    const dueKey = getBillDueKey(bill, payment, year, month);
    if (dueKey && dueKey >= todayKey) {
      const days = getDaysFromToday(dueKey);
      if (days !== null && (nextBill === null || dueKey < nextBill.dateKey)) {
        nextBill = { label: bill.name, dateKey: dueKey, daysFromToday: days };
      }
    }
  }

  return { pendingTotal, nextBill };
}

export function getNextFixedDeposit(assets: Asset[] = []): NextDue {
  let next: NextDue = null;

  for (const asset of assets) {
    if (asset.asset_type !== "FIXED_DEPOSIT" || !asset.maturity) continue;

    const days = getDaysFromToday(asset.maturity);
    if (days === null || days < 0) continue;

    const dateKey = toDateKey(asset.maturity);
    if (next === null || dateKey < next.dateKey) {
      next = { label: asset.name, dateKey, daysFromToday: days };
    }
  }

  return next;
}

export function computeMonthlyHighlights(input: {
  liquidity: number;
  salary?: number;
  transactions: Transaction[];
  assets: Asset[];
  bills: Bill[];
  billPayments: BillPayment[];
}): MonthlyHighlights {
  const { liquidity, salary = 0, transactions, assets, bills, billPayments } = input;

  const spentToday = getSpentToday(transactions);
  const { pendingTotal, nextBill } = getPendingBills(bills, billPayments);
  const nextFixedDeposit = getNextFixedDeposit(assets);

  const daysRemaining = daysRemainingInMonth(new Date());

  // Si hay sueldo definido, usarlo como base; si no, usar liquidez
  const base = salary > 0 ? salary - pendingTotal : Math.max(0, liquidity - pendingTotal);
  const dailyMax = daysRemaining > 0 ? base / daysRemaining : 0;

  return {
    dailyMax,
    daysRemaining,
    spentToday,
    pendingFixedExpenses: pendingTotal,
    nextFixedDeposit,
    nextBill,
  };
}
