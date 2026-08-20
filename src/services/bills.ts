import { apiFetch } from "./api";
import type { Bill, BillPayment, CreateBillInput, CreateBillPaymentInput, UpdateBillInput, UpdateBillPaymentInput } from "@/types/bill";

export function getBills(): Promise<Bill[]> {
  return apiFetch<Bill[]>("/bills");
}

export function createBill(data: CreateBillInput): Promise<Bill> {
  return apiFetch<Bill>("/bills", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteBill(id: number): Promise<{ success?: boolean }> {
  return apiFetch<{ success?: boolean }>(`/bills/${id}`, {
    method: "DELETE",
  });
}

export function updateBill(
  id: number,
  data: UpdateBillInput
): Promise<Bill> {
  return apiFetch<Bill>(`/bills/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getBillPayments(): Promise<BillPayment[]> {
  return apiFetch<BillPayment[]>("/bill_payments");
}

export function createBillPayment(data: CreateBillPaymentInput): Promise<BillPayment> {
  return apiFetch<BillPayment>("/bill_payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteBillPayment(id: number): Promise<{ success?: boolean }> {
  return apiFetch<{ success?: boolean }>(`/bill_payments/${id}`, {
    method: "DELETE",
  });
}

export function updateBillPayment(
  id: number,
  data: UpdateBillPaymentInput
): Promise<BillPayment> {
  return apiFetch<BillPayment>(`/bill_payments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function fetchBillPaymentsByMonth(year: number, month: number): Promise<BillPayment[]> {
  const searchParams = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  return apiFetch<BillPayment[]>(`/bill_payments?${searchParams.toString()}`, {
    method: "GET"
  });
}
