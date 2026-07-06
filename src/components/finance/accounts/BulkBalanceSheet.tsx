import { useEffect, useMemo, useState, JSX } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Account } from "@/types/account";
import { useUpdateAccount } from "@/hooks/mutations/useUpdateAccount";
import { toNumber } from "@/utils/numbers";

type BulkBalanceSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly accounts: Account[];
};

function buildInitialValues(accounts: Account[]): Record<string, string> {
  return accounts.reduce<Record<string, string>>((acc, account) => {
    acc[account.id] = String(toNumber(account.opening_balance));
    return acc;
  }, {});
}

export default function BulkBalanceSheet({
  open,
  onClose,
  accounts,
}: BulkBalanceSheetProps): JSX.Element {
  const { mutateAsync: updateAccount } = useUpdateAccount();

  const [values, setValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setValues(buildInitialValues(accounts));
    setSubmitError(null);
  }, [open, accounts]);

  const changedIds = useMemo(() => {
    return accounts
      .filter((account) => {
        const next = values[account.id];
        if (next === undefined) return false;
        return Number(next) !== toNumber(account.opening_balance);
      })
      .map((account) => account.id);
  }, [accounts, values]);

  async function handleSave() {
    if (changedIds.length === 0) return;

    try {
      setSubmitError(null);
      setIsSaving(true);

      await Promise.all(
        changedIds.map((id) =>
          updateAccount({ id, data: { opening_balance: Number(values[id]) } }),
        ),
      );

      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "No pudimos actualizar los saldos.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Actualizar saldos">
      <div className="space-y-4">
        {submitError && (
          <div className="rounded-lg border border-[var(--color-expense-bg)] bg-[var(--color-expense-bg)] px-3 py-2 text-sm text-[var(--color-expense-text)]">
            {submitError}
          </div>
        )}

        <div className="space-y-2">
          {accounts.map((account) => {
            const isChanged = changedIds.includes(account.id);
            return (
              <div key={account.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                    {account.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {account.currency}
                    {account.institution ? ` · ${account.institution}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isChanged && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]"
                      aria-label="Modificado"
                    />
                  )}
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={values[account.id] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [account.id]: e.target.value }))
                    }
                    className="w-36 rounded-lg border border-[var(--color-border)] px-3 py-2 text-right"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button
          fullWidth
          onClick={handleSave}
          disabled={changedIds.length === 0 || isSaving}
        >
          {isSaving
            ? "Guardando..."
            : changedIds.length > 0
              ? `Guardar ${changedIds.length} ${changedIds.length === 1 ? "cambio" : "cambios"}`
              : "Sin cambios"}
        </Button>
      </div>
    </Modal>
  );
}
