import { JSX, useEffect, useMemo, useState } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import { useCreateTransaction } from "@/hooks/mutations/useCreateTransaction";
import { useCreateBillPayment } from "@/hooks/mutations/useCreateBillPayment";
import { useUpdateBillPayment } from "@/hooks/mutations/useUpdateBillPayment";

import type { Bill, UpdateBillPaymentInput } from "@/types/bill";
import type { BillPayment } from "@/types/bill";
import type { Account } from "@/types/account";
import { toDateKey } from "@/utils/date";

type PayBillSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly bill: Bill | null;
  readonly billPayment?: BillPayment | null;
  readonly accounts?: Account[];
  readonly selectedYear: number;
  readonly selectedMonth: number;
  readonly defaultAmount?: number;
  readonly defaultDate?: string | null;
};

function buildDefaultConcept(
  billName: string,
  year: number,
  month: number,
): string {
  const date = new Date(year, month - 1, 1);

  const monthLabel = new Intl.DateTimeFormat("es-AR", {
    month: "short",
    year: "numeric",
  }).format(date);

  return `${billName} - ${monthLabel}`;
}

export default function PayBillSheet({
  open,
  onClose,
  bill,
  billPayment = null,
  accounts = [],
  selectedYear,
  selectedMonth,
  defaultAmount = 0,
  defaultDate = null,
}: PayBillSheetProps): JSX.Element {
  const { mutateAsync: createTransaction, isPending: isCreatingTransaction } =
    useCreateTransaction();
  const { mutateAsync: createBillPayment, isPending: isCreatingBillPayment } =
    useCreateBillPayment();
  const { mutateAsync: updateBillPayment, isPending: isUpdatingBillPayment } =
    useUpdateBillPayment();

  const initialAccountId = useMemo(() => {
    return bill?.account_id ?? "";
  }, [bill]);

  const initialConcept = useMemo(() => {
    return bill ? buildDefaultConcept(bill.name, selectedYear, selectedMonth) : "";
  }, [bill, selectedMonth, selectedYear]);

  const initialDate = useMemo(() => {
    return toDateKey(
      billPayment?.paid_at ??
      billPayment?.due_date ??
      defaultDate,
    );
  }, [billPayment?.due_date, billPayment?.paid_at, defaultDate]);

  const initialAmount = useMemo(() => {
    const paidAmount =
      billPayment?.paid_amount !== null && billPayment?.paid_amount !== undefined
        ? Number(billPayment.paid_amount)
        : null;

    const expectedAmount =
      billPayment?.expected_amount !== null &&
        billPayment?.expected_amount !== undefined
        ? Number(billPayment.expected_amount)
        : null;

    return String(paidAmount ?? expectedAmount ?? defaultAmount ?? 0);
  }, [billPayment?.expected_amount, billPayment?.paid_amount, defaultAmount]);

  const [accountId, setAccountId] = useState(initialAccountId);
  const [date, setDate] = useState(initialDate);
  const [amount, setAmount] = useState(initialAmount);
  const [concept, setConcept] = useState(initialConcept);
  const [notes, setNotes] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setAccountId(initialAccountId);
    setDate(initialDate);
    setAmount(initialAmount);
    setConcept(initialConcept);
    setNotes("");
    setSubmitError(null);
  }, [
    open,
    initialAccountId,
    initialDate,
    initialAmount,
    initialConcept,
  ]);

  const isPending =
    isCreatingTransaction || isCreatingBillPayment || isUpdatingBillPayment;

  const isValid =
    bill !== null &&
    accountId.trim().length > 0 &&
    date.trim().length > 0 &&
    concept.trim().length > 0 &&
    Number(amount) > 0;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!bill || !isValid) return;

    try {
      setSubmitError(null);

      const parsedAmount = Number(amount);
      const parsedDate = billPayment?.due_date ? billPayment.due_date + "T00:00:00.000Z"
        : defaultDate ? defaultDate + "T00:00:00.000Z" : null;

      const transaction = await createTransaction({
        account_id: accountId,
        concept: concept.trim(),
        amount: parsedAmount,
        date: date + "T00:00:00.000Z",
        category_id: bill.category_id,
        type_id: "2bc1382d-90b2-45ae-b91f-e7d3fd155b2d"
      });

      const paymentPayload: UpdateBillPaymentInput = {
        bill_id: bill.id,
        year: selectedYear,
        month: selectedMonth,
        due_date: parsedDate,
        expected_amount:
          billPayment?.expected_amount ?? parsedAmount,
        paid_amount: parsedAmount,
        paid_at: date + "T00:00:00.000Z",
        status: "paid",
        transaction_id: transaction.id,
        notes: notes.trim() || null,
      };

      if (billPayment?.id) {
        await updateBillPayment({
          id: billPayment.id,
          data: paymentPayload,
        });
      } else {
        await createBillPayment(paymentPayload);
      }

      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No pudimos registrar el pago del impuesto.";

      setSubmitError(message);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar pago">
      {!bill ? (
        <p className="text-sm text-gray-500">No seleccionaste ningún impuesto.</p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
            <p className="text-sm font-medium text-gray-900">{bill.name}</p>

            <div className="mt-1 space-y-1 text-sm text-gray-500">
              {bill.customer_number ? (
                <p>Cliente {bill.customer_number}</p>
              ) : null}

              {bill.due_day ? <p>Vencimiento habitual: día {bill.due_day}</p> : null}
            </div>
          </div>

          {submitError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}

          <div>
            <label
              htmlFor="pay-bill-account"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Cuenta
            </label>
            <select
              id="pay-bill-account"
              value={accountId}
              onChange={(event) => setAccountId(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            >
              <option value="">Seleccionar cuenta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="pay-bill-date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Fecha de pago
            </label>
            <input
              id="pay-bill-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="pay-bill-amount"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Monto pagado
            </label>
            <input
              id="pay-bill-amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder="Ej: 25000"
            />
          </div>

          <div>
            <label
              htmlFor="pay-bill-concept"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Concepto
            </label>
            <input
              id="pay-bill-concept"
              type="text"
              value={concept}
              onChange={(event) => setConcept(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder="Ej: Luz - mar 2026"
            />
          </div>

          <div>
            <label
              htmlFor="pay-bill-notes"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Notas
            </label>
            <textarea
              id="pay-bill-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-24 w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder="Observaciones del pago..."
            />
          </div>

          <Button type="submit" fullWidth disabled={!isValid || isPending}>
            {isPending ? "Registrando..." : "Registrar pago"}
          </Button>
        </form>
      )}
    </Modal>
  );
}