import { apiFetch } from "./api";
import type { Transaction } from "@/types/transaction";

export type CreateTransferInput = {
  amount: number;
  date: string;
  origin_account_id: string;
  destination_account_id: string;
  concept?: string;
  location?: string;
};

type CreateTransferPayload = {
  amount: string;
  date: string;
  origin_account_id: string;
  destination_account_id: string;
  concept?: string;
  location?: string;
};

export type CreateTransferResponse = {
  transfer_group: string;
  origin_transaction: Transaction;
  destination_transaction: Transaction;
};

function mapCreateTransferInput(
  input: CreateTransferInput
): CreateTransferPayload {
  return {
    amount: String(input.amount),
    date: input.date,
    origin_account_id: input.origin_account_id,
    destination_account_id: input.destination_account_id,
    concept: input.concept || undefined,
    location: input.location || undefined,
  };
}

export function createTransfer(
  data: CreateTransferInput
): Promise<CreateTransferResponse> {
  return apiFetch<CreateTransferResponse>("/transfers", {
    method: "POST",
    body: JSON.stringify(mapCreateTransferInput(data)),
  });
}