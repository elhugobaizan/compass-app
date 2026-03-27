import type { Transaction } from "./transaction";

export type TransactionListItem =
  | {
      kind: "transaction";
      transaction: Transaction;
    }
  | {
      kind: "transfer";
      transfer_group: string;
      date: string;
      amount: number;
      concept?: string | null;
      originTransaction: Transaction;
      destinationTransaction: Transaction;
    }