import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import TransactionForm from "@/components/finance/TransactionForm";
import type { Account } from "@/types/account";
import type { Category } from "@/types/category";

type CreateTransactionSheetProps = {
  open: boolean;
  onClose: () => void;
  accounts?: Account[];
  categories?: Category[];
  isLoadingAccounts?: boolean;
  isLoadingCategories?: boolean;
  isErrorAccounts?: boolean;
  isErrorCategories?: boolean;
};

export default function CreateTransactionSheet({
  open,
  onClose,
  accounts = [],
  categories = [],
  isLoadingAccounts = false,
  isLoadingCategories = false,
  isErrorAccounts = false,
  isErrorCategories = false,
}: CreateTransactionSheetProps): JSX.Element {
  const isLoading = isLoadingAccounts || isLoadingCategories;
  const isError = isErrorAccounts || isErrorCategories;

  return (
    <Modal open={open} onClose={onClose} title="Nuevo movimiento">
      {isLoading && (
        <p className="text-sm text-gray-500">Cargando datos del formulario...</p>
      )}

      {isError && (
        <EmptyState
          title="No pudimos cargar el formulario"
          description="Revisá la conexión o el backend e intentá de nuevo."
          variant="error"
        />
      )}

      {!isLoading && !isError && accounts.length === 0 && (
        <EmptyState
          title="No hay cuentas disponibles"
          description="Necesitás al menos una cuenta para registrar un movimiento."
        />
      )}

      {!isLoading && !isError && accounts.length > 0 && (
        <TransactionForm
          accounts={accounts}
          categories={categories}
          onSuccess={onClose}
        />
      )}
    </Modal>
  );
}