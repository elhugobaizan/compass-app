import { JSX, useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import AccountCardSkeleton from "@/components/finance/accounts/AccountCardSkeleton";
import CreateAccountSheet from "@/components/finance/CreateAccountSheet";
import EditAccountSheet from "@/components/finance/EditAccountSheet";

import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";

import { useBreakpoint } from "@/utils/utils";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useDeleteAccount } from "@/hooks/mutations/useDeleteAccount";

import type { Account } from "@/types/account";
import { AccountListItem } from "@/components/finance/accounts/AccountListItem";

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortAccounts(accounts: readonly Account[] = []): Account[] {
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: accounts,
    isLoading,
    isError,
  } = useAccountsQuery();

  const { mutateAsync: deleteAccount, isPending: isDeleting } =
    useDeleteAccount();

  const sortedAccounts = useMemo(() => sortAccounts(accounts ?? []), [accounts]);

  async function handleConfirmDelete() {
    if (!accountToDelete) return;

    try {
      setSubmitError(null);
      await deleteAccount(accountToDelete.id);
      setAccountToDelete(null);
    } catch (error) {
      if (error instanceof Error) {
        try {
          setSubmitError(JSON.parse(error.message));
        } catch {
          setSubmitError(error.message);
        }
      } else {
        setSubmitError("Error inesperado.");
      }
    }
  }

  const listClassName = isMobile ? "space-y-3" : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3";
  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title={isMobile ? "Cuentas" : ""}
        description={
          isMobile ? undefined : "Administrá wallets, bancos y brokers."
        }
        action={
          <Button onClick={() => setIsCreateAccountOpen(true)}>
            + Cuenta
          </Button>
        }
      />

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {isLoading && (
        <div className={listClassName}>
          <AccountCardSkeleton compact={isMobile} />
          <AccountCardSkeleton compact={isMobile} />
          <AccountCardSkeleton compact={isMobile} />
        </div>
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
        <div className={listClassName}>
          {sortedAccounts.map((account) => (
            <AccountListItem
              key={account.id}
              account={account}
              compact={isMobile}
              onEdit={setAccountToEdit}
              onDelete={setAccountToDelete}
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
        loadingText="Eliminando..."
        confirmVariant="danger"
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