import { JSX, useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import TransactionRow from "@/components/finance/TransactionRow";
import CreateTransactionSheet from "@/components/finance/CreateTransactionSheet";

import { useBreakpoint } from "@/utils/utils";
import { useTransactionsQuery } from "@/hooks/queries/useTransactionsQuery";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { useDeleteTransaction } from "@/hooks/mutations/useDeleteTransaction";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { transactionTypeLabels } from "@/utils/transactionTypes";
import type { Transaction } from "@/types/transaction";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import EditTransactionSheet from "@/components/finance/EditTransactionSheet";

function sortTransactionsDesc(transactions: Transaction[] = []): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default function TransactionsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();
  const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
  } = useTransactionsQuery();

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
  } = useAccountsQuery();

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useCategoriesQuery();

  const { mutateAsync: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();

  const sortedTransactions = useMemo(
    () => sortTransactionsDesc(transactions ?? []),
    [transactions]
  );

  async function handleConfirmDelete() {
    if (!transactionToDelete) return;

    await deleteTransaction(transactionToDelete.id);
    setTransactionToDelete(null);
  }

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title="Movimientos"
        description={
          isMobile ? undefined : "Consultá y cargá ingresos, gastos y movimientos"
        }
        action={
          <Button onClick={() => setIsCreateTransactionOpen(true)}>
            + Movimiento
          </Button>
        }
      />

      {isLoadingTransactions && (
        <p className="text-sm text-gray-500">Cargando movimientos...</p>
      )}

      {isErrorTransactions && (
        <EmptyState
          title="No pudimos cargar los movimientos"
          description="Revisá el backend o la conexión e intentá de nuevo."
          variant="error"
        />
      )}

      {!isLoadingTransactions &&
        !isErrorTransactions &&
        sortedTransactions.length === 0 && (
          <EmptyState
            title="Todavía no hay movimientos"
            description="Creá tu primer movimiento para empezar a poblar la app."
            action={
              <Button onClick={() => setIsCreateTransactionOpen(true)}>
                Crear movimiento
              </Button>
            }
          />
        )}

      {!isLoadingTransactions &&
        !isErrorTransactions &&
        sortedTransactions.length > 0 && (
          <div className="space-y-3">
            {sortedTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                amount={transaction.amount}
                date={transaction.date}
                concept={transaction.concept}
                typeLabel={transactionTypeLabels[transaction.type.name]}
                categoryLabel={transaction.category?.name}
                location={transaction.location}
                onDelete={() => setTransactionToDelete(transaction)}
                onEdit={() => setTransactionToEdit(transaction)}
              />
            ))}
          </div>
        )}

      <CreateTransactionSheet
        open={isCreateTransactionOpen}
        onClose={() => setIsCreateTransactionOpen(false)}
        accounts={accounts}
        categories={categories}
        isLoadingAccounts={isLoadingAccounts}
        isLoadingCategories={isLoadingCategories}
        isErrorAccounts={isErrorAccounts}
        isErrorCategories={isErrorCategories}
      />

      <EditTransactionSheet
        open={!!transactionToEdit}
        onClose={() => setTransactionToEdit(null)}
        transaction={transactionToEdit}
        accounts={accounts}
        categories={categories}
        isLoadingAccounts={isLoadingAccounts}
        isLoadingCategories={isLoadingCategories}
        isErrorAccounts={isErrorAccounts}
        isErrorCategories={isErrorCategories}
      />

      <ConfirmDialog
        open={!!transactionToDelete}
        title="Eliminar movimiento"
        description="Esta acción quitará el movimiento del listado y actualizará el resumen."
        confirmText="Eliminar"
        isLoading={isDeleting}
        onClose={() => setTransactionToDelete(null)}
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