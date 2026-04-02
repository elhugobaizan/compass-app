import { Account } from "./account";
import { Category } from "./category";
import { Transaction } from "./transaction";

export type BillPayment = {
  id: string;
  bill_id: string;
  year: number;
  month: number;
  due_date: string | null;
  expected_amount: number | null;
  paid_amount: number | null;
  paid_at: string | null;
  status: "paid" | "pending" | "overdue";
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  bill: Bill;
  transaction: Transaction | null;
};

export type Bill = {
  id: string;
  name: string;
  due_day: number | null;
  account_id: string | null;
  notes: string | null;
  logo: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category_id: string | null;
  customer_number: string | null;
  default_amount: number;
  is_active: boolean;
  provider: string | null;
  reference_number: string | null;

  account: Account | null;
  category: Category | null;
};

export type BillInput = Omit<Bill, "id" | "created_at" | "updated_at" | "deleted_at" | "account" | "category">;

export type CreateBillInput = BillInput;
export type UpdateBillInput = BillInput;

export type BillPaymentInput = Omit<BillPayment, "id" | "created_at" | "updated_at" | "deleted_at" | "bill" | "transaction">;

export type CreateBillPaymentInput = BillPaymentInput;
export type UpdateBillPaymentInput = BillPaymentInput;