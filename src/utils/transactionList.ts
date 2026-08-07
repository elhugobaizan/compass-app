import type { Transaction } from "@/types/transaction";
import type { TransactionListItem } from "@/types/transactionList";
import { TRANSACTION_TYPES } from "./transactionTypes";

export function sortTransactionsDesc(transactions: Transaction[]): Transaction[] {
  return  [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function isTransfer(transaction: Transaction): boolean {
  return (transaction.type.name === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA
     || transaction.type.name === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA)
     && !!transaction.transfer_group;
}

/**
 * Origen y destino se resuelven por el TIPO de movimiento (dato confiable),
 * no por el texto del concepto ni por el orden del array: dos filas de la misma
 * transferencia comparten fecha, así que el orden que devuelve la DB es arbitrario.
 */
function resolveTransferPair(grouped: Transaction[]): {
  originTransaction: Transaction;
  destinationTransaction: Transaction;
} {
  if (grouped.length < 2) {
    return {
      originTransaction: grouped[0],
      destinationTransaction: grouped[0],
    };
  }

  const origin =
    grouped.find(
      (tx) => tx.type?.name === TRANSACTION_TYPES.TRANSFERENCIA_SALIDA,
    ) ?? grouped[0];

  const destination =
    grouped.find(
      (tx) => tx.type?.name === TRANSACTION_TYPES.TRANSFERENCIA_ENTRADA,
    ) ?? grouped.find((tx) => tx.id !== origin.id) ?? grouped[1];

  return {
    originTransaction: origin,
    destinationTransaction: destination,
  };
}

export function buildTransactionListItems(
  transactions: Transaction[] = []
): TransactionListItem[] {
  const sorted = sortTransactionsDesc(transactions);
  const items: TransactionListItem[] = [];
  const processedTransferGroups = new Set<string>();

  for (const transaction of sorted) {
    if (!isTransfer(transaction)) {
      items.push({
        kind: "transaction",
        transaction,
      });
      continue;
    }

    const transferGroup = transaction.transfer_group as string;

    if (processedTransferGroups.has(transferGroup)) {
      continue;
    }

    const grouped = sorted.filter(
      (tx) => isTransfer(tx) && tx.transfer_group === transferGroup
    );

    if (grouped.length < 2) {
      items.push({
        kind: "transaction",
        transaction,
      });
      continue;
    }

    const { originTransaction, destinationTransaction } =
      resolveTransferPair(grouped);

    items.push({
      kind: "transfer",
      transfer_group: transferGroup,
      date: originTransaction.date,
      amount: originTransaction.amount,
      concept: originTransaction.concept ?? destinationTransaction.concept,
      originTransaction,
      destinationTransaction,
    });

    processedTransferGroups.add(transferGroup);
  }

  return items;
}