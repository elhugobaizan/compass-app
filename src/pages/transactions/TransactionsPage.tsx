import { JSX, useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CreateTransactionSheet from "@/components/finance/CreateTransactionSheet";
import EditTransactionSheet from "@/components/finance/EditTransactionSheet";
import CreateTransferSheet from "@/components/finance/CreateTransferSheet";

import { useBreakpoint } from "@/utils/utils";
import { TRANSACTION_TYPES } from "@/utils/transactionTypes";
import { buildTransactionListItems } from "@/utils/transactionList";
import { useTransactionsQuery } from "@/hooks/queries/useTransactionsQuery";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { useDeleteTransaction } from "@/hooks/mutations/useDeleteTransaction";

import type { Transaction } from "@/types/transaction";

import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { ArrowLeftRight, ArrowUpRight } from "lucide-react";
import TransactionSummary from "@/components/finance/transactions/TransactionSummary";
import TransactionListItem from "@/components/finance/transactions/TransactionListItem";
import TransactionCardSkeleton from "@/components/finance/transactions/TransactionCardSkeleton";
import { toNumber } from "@/utils/numbers";
import { formatCurrency } from "@/utils/formatters";

function getTransactionSummaryValues(
  transactions: readonly {
    amount: string | number;
    type: { name: string };
  }[] | undefined,
): {
  totalTransactions: number;
  totalIncomeAmount: number;
  totalExpenseAmount: number;
  totalIncomesCount: number;
  totalExpensesCount: number;
} {
  if (!transactions || transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalIncomeAmount: 0,
      totalExpenseAmount: 0,
      totalIncomesCount: 0,
      totalExpensesCount: 0,
    };
  }

  return transactions.reduce(
    (acc, transaction) => {
      const amount = toNumber(transaction.amount);

      acc.totalTransactions += 1;

      if (transaction.type.name === TRANSACTION_TYPES.INGRESO) {
        acc.totalIncomesCount += 1;
        acc.totalIncomeAmount += amount;
      }

      if (transaction.type.name === TRANSACTION_TYPES.GASTO) {
        acc.totalExpensesCount += 1;
        acc.totalExpenseAmount += amount;
      }

      return acc;
    },
    {
      totalTransactions: 0,
      totalIncomeAmount: 0,
      totalExpenseAmount: 0,
      totalIncomesCount: 0,
      totalExpensesCount: 0,
    },
  );
}

export default function TransactionsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();
  const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false);
  const [isCreateTransferOpen, setIsCreateTransferOpen] = useState(false);
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


  const transactionListItems = useMemo(
    () => buildTransactionListItems(transactions ?? []),
    [transactions]
  );

  const summary = useMemo(() => getTransactionSummaryValues(transactions), [transactions]);

  async function handleConfirmDelete() {
    if (!transactionToDelete) return;

    await deleteTransaction(transactionToDelete.id);
    setTransactionToDelete(null);
  }

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-8"}>
      <PageHeader
        title={isMobile ? "Movimientos" : ""}
        description={
          isMobile ? undefined : "Consultá y cargá ingresos, gastos y movimientos"
        }
        action={
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => setIsCreateTransactionOpen(true)}>
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              Movimiento
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsCreateTransferOpen(true)}>
              <ArrowLeftRight className="mr-1 h-3.5 w-3.5" />
              Transferencia
            </Button>
          </div>
        }
        summary={!isMobile && (<TransactionSummary
          totalTransactions={summary.totalTransactions}
          totalIncomes={formatCurrency(summary.totalIncomeAmount)}
          totalExpenses={formatCurrency(summary.totalExpenseAmount)}
          totalIncomesCount={summary.totalIncomesCount}
          totalExpensesCount={summary.totalExpensesCount}
        />
        )}
      />

      {!isMobile && (<div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Actividad reciente
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>)}

      {isLoadingTransactions && (
        <TransactionCardSkeleton count={isMobile ? 5 : 6} showActions={!isMobile} />
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
        transactionListItems.length === 0 && (
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
        transactionListItems.length > 0 && (
          <div className="space-y-3">
            {transactionListItems.map((item) => {
              if (item.kind === "transfer") {
                return (<TransactionListItem
                  key={item.transfer_group}
                  kind="transfer"
                  isMobile={isMobile}
                  item={item}
                />);
              }

              const transaction = item.transaction;

              return (<TransactionListItem
                key={transaction.id}
                kind="transaction"
                isMobile={isMobile}
                concept={transaction.concept}
                amount={transaction.amount}
                date={transaction.date}
                typeLabel={transaction.type.name}
                categoryLabel={transaction.category?.name}
                location={transaction.location}
                onDelete={() => setTransactionToDelete(transaction)}
                onEdit={() => setTransactionToEdit(transaction)}
              />)
            })}
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

      <CreateTransferSheet
        open={isCreateTransferOpen}
        onClose={() => setIsCreateTransferOpen(false)}
        accounts={accounts}
        isLoadingAccounts={isLoadingAccounts}
        isErrorAccounts={isErrorAccounts}
      />

      <ConfirmDialog
        open={!!transactionToDelete}
        title="Eliminar movimiento"
        description="Esta acción quitará el movimiento del listado y actualizará el resumen."
        confirmText="Eliminar"
        loadingText="Eliminando..."
        confirmVariant="danger"
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