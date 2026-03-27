import { JSX, useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import AccountCard, {
  AccountType,
} from "@/components/finance/AccountCard";
import AccountCardSkeleton from "@/components/finance/AccountCardSkeleton";
import CreateAccountSheet from "@/components/finance/CreateAccountSheet";
import EditAccountSheet from "@/components/finance/EditAccountSheet";

import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";

import { useBreakpoint } from "@/utils/utils";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useDeleteAccount } from "@/hooks/mutations/useDeleteAccount";

import type { Account } from "@/types/account";

import { Pencil, Trash2 } from "lucide-react";

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

function mapAccountType(accountType: string): AccountType {
  switch (accountType) {
    case "BANK":
    case "WALLET":
    case "BROKER":
      return accountType;
    default:
      return "BANK";
  }
}

type AccountListItemProps = {
  readonly account: Account;
  readonly compact?: boolean;
  readonly onEdit: (account: Account) => void;
  readonly onDelete: (account: Account) => void;
};

function AccountListItem({
  account,
  compact = false,
  onEdit,
  onDelete,
}: AccountListItemProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <AccountCard
        name={account.name}
        institution={account.institution}
        currency={account.currency}
        accountType={mapAccountType(account.account_type)}
        balance={account.opening_balance ?? "-"}
        isPaymentMethod={account.is_payment_method}
        compact={compact}
        unstyled
      />

      {!compact && (
         <div className="border-t border-gray-100 bg-gray-50/80">
        <div className="flex items-center justify-end gap-2 px-4 py-3">
            <Button variant="secondary" size="sm" onClick={() => onEdit(account)}>
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Editar
            </Button>
            <Button variant="danger-ghost" size="sm" onClick={() => onDelete(account)}>
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Eliminar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
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

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title="Cuentas"
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
        <div
          className={
            isMobile
              ? "space-y-3"
              : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          }
        >
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
        <div
          className={
            isMobile
              ? "space-y-3"
              : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          }
        >
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