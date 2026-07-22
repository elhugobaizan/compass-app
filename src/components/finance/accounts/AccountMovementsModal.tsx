import { JSX, useMemo, useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import {
  getAccountMovements,
  signedAmount,
  computeAccountBreakdown,
} from "@/utils/accountBalance";
import { formatCurrency } from "@/utils/formatters";
import { toNumber } from "@/utils/numbers";
import { parseLocalDate } from "@/utils/date";
import { TRANSACTION_TYPE_IDS } from "@/utils/transactionTypes";
import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";

type AccountMovementsModalProps = {
  readonly account: Account | null;
  readonly transactions: Transaction[];
  readonly balance?: number;
  readonly onClose: () => void;
};

function formatDate(date: string): string {
  return parseLocalDate(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AccountMovementsModal({
  account,
  transactions,
  balance,
  onClose,
}: AccountMovementsModalProps): JSX.Element | null {
  const movements = useMemo(
    () => (account ? getAccountMovements(account, transactions) : []),
    [account, transactions],
  );

  const breakdown = useMemo(
    () => (account ? computeAccountBreakdown(account, transactions) : null),
    [account, transactions],
  );

  const [isAdjusting, setIsAdjusting] = useState(false);
  const [realBalance, setRealBalance] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createTransaction, isPending } = useCreateTransaction();

  // Reset del form al cambiar de cuenta
  useEffect(() => {
    setIsAdjusting(false);
    setRealBalance("");
    setError(null);
  }, [account?.id]);

  if (!account) return null;

  const openingBalance = toNumber(account.opening_balance);
  const currentBalance = breakdown?.balance ?? balance ?? openingBalance;
  const accruedInterest = breakdown?.accruedInterest ?? 0;
  const interestDays = breakdown?.interestDays ?? 0;

  const parsedReal = Number(realBalance);
  const hasValidReal = realBalance.trim() !== "" && Number.isFinite(parsedReal);
  const delta = hasValidReal ? parsedReal - currentBalance : 0;

  async function handleAdjust() {
    if (!account || !hasValidReal || delta === 0) return;

    try {
      setError(null);
      await createTransaction({
        account_id: account.id,
        type_id: TRANSACTION_TYPE_IDS.AJUSTE,
        amount: delta,
        date: new Date().toISOString(),
        concept: "Ajuste de saldo",
      });
      setIsAdjusting(false);
      setRealBalance("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos registrar el ajuste.");
    }
  }

  return (
    <Modal open={!!account} title={account.name} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-3">
            <p className="text-xs text-[var(--color-muted)]">Saldo inicial</p>
            <p className="mt-1 font-serif text-base font-semibold text-[var(--color-ink)]">
              {formatCurrency(openingBalance)}
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-3">
            <p className="text-xs text-[var(--color-muted)]">Saldo actual</p>
            <p className="mt-1 font-serif text-base font-semibold text-[var(--color-ink)]">
              {formatCurrency(currentBalance)}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-ink)]">
            Movimientos que ajustan el saldo ({movements.length})
          </p>

          {movements.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-4 text-center text-sm text-[var(--color-muted)]">
              No hay movimientos posteriores al saldo inicial.
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
              {movements.map((tx) => {
                const impact = signedAmount(tx);
                const isPositive = impact >= 0;

                return (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                        {tx.concept || tx.type?.name || "Movimiento"}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {formatDate(tx.date)}
                      </p>
                    </div>
                    <span
                      className={
                        isPositive
                          ? "shrink-0 text-sm font-semibold text-[var(--color-income)]"
                          : "shrink-0 text-sm font-semibold text-[var(--color-expense)]"
                      }
                    >
                      {isPositive ? "+" : "-"} {formatCurrency(Math.abs(impact))}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {accruedInterest !== 0 && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#E7D3B3] bg-[#F6EAD5]/50 px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#8A5A2E]">
                  Intereses devengados
                </p>
                <p className="text-xs text-[var(--color-muted)]">
                  {interestDays} {interestDays === 1 ? "día" : "días"}
                  {account.interest_rate ? ` · ${toNumber(account.interest_rate)}% TNA` : ""}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-[#8A5A2E]">
                {accruedInterest >= 0 ? "+" : "-"} {formatCurrency(Math.abs(accruedInterest))}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--color-border)] pt-4">
          {!isAdjusting ? (
            <Button variant="secondary" fullWidth onClick={() => setIsAdjusting(true)}>
              Ajustar saldo
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
                  Saldo real de la cuenta
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={realBalance}
                  onChange={(e) => setRealBalance(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-lg"
                  placeholder={String(currentBalance)}
                  autoFocus
                />
                {hasValidReal && delta !== 0 && (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    Se registrará un ajuste de{" "}
                    <span
                      className={
                        delta > 0
                          ? "font-semibold text-[var(--color-income)]"
                          : "font-semibold text-[var(--color-expense)]"
                      }
                    >
                      {delta > 0 ? "+" : "-"} {formatCurrency(Math.abs(delta))}
                    </span>
                  </p>
                )}
                {hasValidReal && delta === 0 && (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    El saldo ya coincide, no hace falta ajustar.
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-[var(--color-expense-bg)] bg-[var(--color-expense-bg)] px-3 py-2 text-sm text-[var(--color-expense-text)]">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsAdjusting(false);
                    setRealBalance("");
                    setError(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  fullWidth
                  onClick={handleAdjust}
                  disabled={!hasValidReal || delta === 0 || isPending}
                >
                  {isPending ? "Guardando..." : "Confirmar ajuste"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
