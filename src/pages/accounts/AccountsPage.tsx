import { JSX, useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import AccountCard from "@/components/finance/AccountCard";
import CreateAccountSheet from "@/components/finance/CreateAccountSheet";
import EditAccountSheet from "@/components/finance/EditAccountSheet";

import { useBreakpoint } from "@/utils/utils";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { accountGroupLabels } from "@/utils/accountGroups";

import type { Account } from "@/types/account";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useDeleteAccount } from "@/hooks/mutations/useDeleteAccount";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortAccounts(accounts: Account[] = []): Account[] {
  return [...accounts].sort((a, b) => {
    const aOrder = a.display_order ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.display_order ?? Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return toNumber(b.opening_balance) - toNumber(a.opening_balance);
  });
}

export default function AccountsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);

  const {
    data: accounts,
    isLoading,
    isError,
  } = useAccountsQuery();

  const { mutateAsync: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const sortedAccounts = useMemo(
    () => sortAccounts(accounts ?? []),
    [accounts]
  );

  async function handleConfirmDelete() {
    if (!accountToDelete) return;

    await deleteAccount(accountToDelete.id);
    setAccountToDelete(null);
  }

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title="Cuentas"
        description={
          isMobile
            ? undefined
            : "Administrá wallets, bancos, brokers y cuentas de deuda"
        }
        action={
          <Button onClick={() => setIsCreateAccountOpen(true)}>
            + Cuenta
          </Button>
        }
      />

      {isLoading && (
        <p className="text-sm text-gray-500">Cargando cuentas...</p>
      )}

      {isError && (
        <EmptyState
          title="No pudimos cargar las cuentas"
          description="Revisá el backend o la conexión e intentá de nuevo."
          variant="error"
        />
      )}

      {!isLoading && !isError && sortedAccounts.length === 0 && (
        <EmptyState
          title="Todavía no hay cuentas"
          description="Creá tu primera cuenta para empezar a poblar la app."
          action={
            <Button onClick={() => setIsCreateAccountOpen(true)}>
              Crear cuenta
            </Button>
          }
        />
      )}

      {!isLoading && !isError && sortedAccounts.length > 0 && (
        <div
          className={
            isMobile
              ? "space-y-4"
              : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          }
        >
          {sortedAccounts.map((account) => (
            <AccountCard
              key={account.id}
              name={account.name}
              institution={account.institution}
              currency={account.currency}
              accountType={account.account_type}
              accountGroup={
                accountGroupLabels[account.account_group.name] ?? "UNKNOWN"
              }
              balance={account.opening_balance ?? "-"}
              isPaymentMethod={account.is_payment_method}
              action={
                <div className="flex items-center gap-2">
                  <Button
                    key="edit"
                    onClick={() => setAccountToEdit(account)}
                  >
                    Editar
                  </Button>
                  <Button
                    key="delete"
                    onClick={() => setAccountToDelete(account)}
                  >
                    Eliminar
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}

      <CreateAccountSheet
        open={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
      />

      <EditAccountSheet
        open={!!accountToEdit}
        onClose={() => setAccountToEdit(null)}
        account={accountToEdit}
      />

      <ConfirmDialog
        open={!!accountToDelete}
        title="Eliminar cuenta"
        description="Esta acción quitará la cuenta del listado y actualizará el resumen."
        confirmText="Eliminar"
        isLoading={isDeleting}
        onClose={() => setAccountToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}