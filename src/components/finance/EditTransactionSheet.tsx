import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import TransactionForm from "@/components/finance/transactions/TransactionForm";
import type { Account } from "@/types/account";
import type { Category } from "@/types/category";
import type { Transaction } from "@/types/transaction";

type EditTransactionSheetProps = {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  accounts?: Account[];
  categories?: Category[];
  isLoadingAccounts?: boolean;
  isLoadingCategories?: boolean;
  isErrorAccounts?: boolean;
  isErrorCategories?: boolean;
};

export default function EditTransactionSheet({
  open,
  onClose,
  transaction,
  accounts = [],
  categories = [],
  isLoadingAccounts = false,
  isLoadingCategories = false,
  isErrorAccounts = false,
  isErrorCategories = false,
}: EditTransactionSheetProps): JSX.Element {
  const isLoading = isLoadingAccounts || isLoadingCategories;
  const isError = isErrorAccounts || isErrorCategories;

  return (
    <Modal open={open} onClose={onClose} title="Editar movimiento">
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

      {!isLoading && !isError && !transaction && (
        <EmptyState
          title="No encontramos el movimiento"
          description="Probá cerrando e intentando de nuevo."
          variant="error"
        />
      )}

      {!isLoading && !isError && transaction && accounts.length > 0 && (
        <TransactionForm
          mode="edit"
          transactionId={transaction.id}
          accounts={accounts}
          categories={categories}
          initialValues={{
            concept: transaction.concept ?? "",
            amount: transaction.amount,
            date: transaction.date.slice(0, 10),
            account_id: transaction.account_id,
            category_id: transaction.category_id ?? "",
            type_id: transaction.type_id ?? "",
            location: transaction.location ?? "",
          }}
          onSuccess={onClose}
        />
      )}
    </Modal>
  );
}