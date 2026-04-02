import { JSX, useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SummaryCard from "@/components/ui/SummaryCard";

import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";

import CreateBillSheet from "@/components/finance/CreateBillSheet";
import EditBillSheet from "@/components/finance/EditBillSheet";
import PayBillSheet from "@/components/finance/PayBillSheet";
import BillListItem from "@/components/finance/bills/BillListItem";
import BillCardSkeleton from "@/components/finance/bills/BillCardSkeleton";

import { useBreakpoint } from "@/utils/utils";
import { useBillsQuery } from "@/hooks/queries/useBillsQuery";
import { useBillPaymentsByMonthQuery } from "@/hooks/queries/useBillPaymentsByMonthQuery";
import { useDeleteBill } from "@/hooks/mutations/useDeleteBill";

import type { Bill, BillPayment } from "@/types/bill";
import { toNumber } from "@/utils/numbers";
import { formatCurrency } from "@/utils/formatters";
import { addMonths, getMonthLabel, getTodayKey, pad2, startOfMonth, toDateKey } from "@/utils/date";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import ViewBillSheet from "@/components/finance/ViewBillSheet";

type BillStatusFilter = "all" | "pending" | "paid" | "overdue";

type BillRow = {
  readonly bill: Bill;
  readonly billPayment: BillPayment | null;
  readonly status: "pending" | "paid" | "overdue";
  readonly dueDate: string | null;
  readonly amount: number;
  readonly paidAt: string | null;
};

const STATUS_FILTERS: ReadonlyArray<{
  readonly label: string;
  readonly value: BillStatusFilter;
}> = [
    { label: "Todos", value: "all" },
    { label: "Pendientes", value: "pending" },
    { label: "Pagados", value: "paid" },
    { label: "Vencidos", value: "overdue" },
  ];

function toMonthQuery(date: Date): { year: number; month: number } {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

function formatCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getComputedStatus(
  billPayment: BillPayment | null,
  dueDate: string | null,
): "pending" | "paid" | "overdue" {
  if (billPayment?.status === "paid" || billPayment?.paid_at) {
    return "paid";
  }

  const todayKey = getTodayKey();
  if (dueDate && todayKey && dueDate < todayKey) {
    return "overdue";
  }

  return "pending";
}

function compareRows(left: BillRow, right: BillRow): number {
  const statusOrder: Record<BillRow["status"], number> = {
    overdue: 0,
    pending: 1,
    paid: 2,
  };

  const byStatus = statusOrder[left.status] - statusOrder[right.status];
  if (byStatus !== 0) return byStatus;

  const leftDue = left.dueDate ?? "9999-12-31";
  const rightDue = right.dueDate ?? "9999-12-31";

  const byDueDate = leftDue.localeCompare(rightDue);
  if (byDueDate !== 0) return byDueDate;

  return left.bill.name.localeCompare(right.bill.name);
}

export default function BillsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();

  const [selectedMonth, setSelectedMonth] = useState<Date>(() =>
    startOfMonth(new Date()),
  );
  const [statusFilter, setStatusFilter] = useState<BillStatusFilter>("all");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [deletingBill, setDeletingBill] = useState<Bill | null>(null);
  const [viewingBill, setViewingBill] = useState<BillRow | null>(null);
  const [payingBill, setPayingBill] = useState<BillRow | null>(null);

  const { year, month } = useMemo(
    () => toMonthQuery(selectedMonth),
    [selectedMonth],
  );

  const {
    data: bills = [],
    isLoading: isBillsLoading,
    isFetching: isBillsFetching,
  } = useBillsQuery();

  const {
    data: billPayments = [],
    isLoading: isBillPaymentsLoading,
    isFetching: isBillPaymentsFetching,
  } = useBillPaymentsByMonthQuery(year, month);

  const { data: accounts = [], isLoading: isLoadingAccounts, isError: isErrorAccounts } = useAccountsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  const deleteBillMutation = useDeleteBill();

  const paymentsByBillId = useMemo(() => {
    return new Map<string, BillPayment>(
      billPayments.map((billPayment: BillPayment) => [billPayment.bill_id, billPayment]),
    );
  }, [billPayments]);

  const rows = useMemo<BillRow[]>(() => {
    return bills
      .filter((bill) => bill.deleted_at == null)
      .filter((bill) => bill.is_active !== false)
      .map((bill) => {
        const billPayment = paymentsByBillId.get(bill.id) ?? null;


        const dueDate =
          toDateKey(billPayment?.due_date) !== "" ? toDateKey(billPayment?.due_date) :
            (bill.due_day
              ? `${year}-${pad2(month)}-${pad2(bill.due_day)}`
              : null);
        const amount =
          toNumber(billPayment?.expected_amount) ||
          toNumber(billPayment?.paid_amount) ||
          toNumber(bill.default_amount);

        const paidAt = billPayment?.paid_at ?? null;
        const status = getComputedStatus(billPayment, dueDate);

        return {
          bill,
          billPayment,
          status,
          dueDate,
          amount,
          paidAt,
        };
      })
      .sort(compareRows);
  }, [bills, month, paymentsByBillId, year]);

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  const summary = useMemo(() => {
    const totalEstimated = rows.reduce((acc, row) => acc + row.amount, 0);
    const totalPaid = rows
      .filter((row) => row.status === "paid")
      .reduce(
        (acc, row) =>
          acc +
          (toNumber(row.billPayment?.paid_amount) ||
            toNumber(row.billPayment?.expected_amount) ||
            row.amount),
        0,
      );
    const totalPending = rows
      .filter((row) => row.status !== "paid")
      .reduce((acc, row) => acc + row.amount, 0);
    const overdueCount = rows.filter((row) => row.status === "overdue").length;
    const pendingCount = rows.filter((row) => row.status === "pending").length;
    const paidCount = rows.filter((row) => row.status === "paid").length;

    return {
      totalEstimated,
      totalPaid,
      totalPending,
      overdueCount,
      pendingCount,
      paidCount,
    };
  }, [rows]);

  const isLoading = isBillsLoading || isBillPaymentsLoading;
  const isFetching = isBillsFetching || isBillPaymentsFetching;

  function handlePreviousMonth(): void {
    setSelectedMonth((current) => addMonths(current, -1));
  }

  function handleNextMonth(): void {
    setSelectedMonth((current) => addMonths(current, 1));
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingBill) return;

    await deleteBillMutation.mutateAsync(deletingBill.id);
    setDeletingBill(null);
  }

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title="Impuestos"
        action={
          <Button onClick={() => setIsCreateOpen(true)}>Nuevo impuesto</Button>
        }
      />

      <section className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4">
        <Button variant="ghost" onClick={handlePreviousMonth}>
          Anterior
        </Button>

        <div className="min-w-0 text-center">
          <p className="text-sm text-muted-foreground">Mes seleccionado</p>
          <h2 className="truncate text-lg font-semibold capitalize">
            {getMonthLabel(selectedMonth)}
          </h2>
        </div>

        <Button variant="ghost" onClick={handleNextMonth}>
          Siguiente
        </Button>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Total estimado"
          value={formatCurrency(summary.totalEstimated)}
          helperText={formatCountLabel(rows.length, "impuesto", "impuestos")}
        />
        <SummaryCard
          label="Pagado"
          value={formatCurrency(summary.totalPaid)}
          helperText={formatCountLabel(
            summary.paidCount,
            "registrado",
            "registrados",
          )}
        />
        <SummaryCard
          label="Pendiente"
          value={formatCurrency(summary.totalPending)}
          helperText={
            summary.overdueCount > 0
              ? `${summary.overdueCount} vencido${summary.overdueCount === 1 ? "" : "s"} incluido${summary.overdueCount === 1 ? "" : "s"}`
              : formatCountLabel(
                summary.pendingCount,
                "por pagar",
                "por pagar",
              )
          }
        />
      </section>

      <section className="mt-6">
        <div className="mb-4 border-t border-border pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Vencimientos del mes
            </h2>

            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => {
                const isActive = filter.value === statusFilter;

                return (
                  <Button
                    key={filter.value}
                    variant={isActive ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setStatusFilter(filter.value)}
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <BillCardSkeleton />
            <BillCardSkeleton />
            <BillCardSkeleton />
          </div>
        ) : filteredRows.length === 0 ? (
          rows.length === 0 ? (
            <EmptyState
              title="Todavía no tenés impuestos cargados"
              description="Agregá tus gastos fijos mensuales para seguir vencimientos y registrar pagos."
              action={<Button onClick={() => setIsCreateOpen(true)}>Nuevo impuesto</Button>}
            />
          ) : (
            <EmptyState
              title="No hay resultados para este filtro"
              description="Probá con otro estado o revisá otro mes."
              action={<Button onClick={() => setStatusFilter("all")}>Ver todos</Button>}
            />
          )
        ) : (
          <div className="space-y-3">
            {filteredRows.map((row) => (
              <BillListItem
                key={row.bill.id}
                name={row.bill.name}
                customerNumber={row.bill.customer_number}
                dueDate={row.dueDate}
                amount={row.amount}
                status={row.status}
                paidAt={row.paidAt}
                accountName={row.bill.account?.name ?? null}
                onClick={() => setEditingBill(row.bill)}
                onPay={() => setPayingBill(row)}
                onEdit={() => setEditingBill(row.bill)}
                onView={() => setViewingBill(row)}
                onDelete={() => setDeletingBill(row.bill)}
              />
            ))}
          </div>
        )}

        {isFetching && !isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Actualizando…</p>
        ) : null}
      </section>

      <CreateBillSheet
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        accounts={accounts}
        isLoadingAccounts={isLoadingAccounts}
        isErrorAccounts={isErrorAccounts}
        categories={categories}
      />

      <EditBillSheet
        open={editingBill !== null}
        onClose={() => setEditingBill(null)}
        bill={editingBill}
        accounts={accounts}
        isLoadingAccounts={isLoadingAccounts}
        isErrorAccounts={isErrorAccounts}
        categories={categories}
      />

      <ViewBillSheet
        open={viewingBill !== null}
        onClose={() => setViewingBill(null)}
        row={viewingBill}
      />

      <PayBillSheet
        open={payingBill !== null}
        onClose={() => setPayingBill(null)}
        bill={payingBill?.bill ?? null}
        billPayment={payingBill?.billPayment ?? null}
        defaultAmount={payingBill?.amount ?? 0}
        defaultDate={payingBill?.dueDate ?? null}
        selectedYear={year}
        selectedMonth={month}
        accounts={accounts}
      />

      <ConfirmDialog
        open={deletingBill !== null}
        title="Eliminar impuesto"
        description={
          deletingBill
            ? `Se eliminará "${deletingBill.name}".`
            : "Se eliminará este impuesto."
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        loadingText="Eliminando..."
        isLoading={deleteBillMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingBill(null)}
      />
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}