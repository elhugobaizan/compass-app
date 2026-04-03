import { JSX } from "react";

import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import type { Bill } from "@/types/bill";
import type { BillPayment } from "@/types/bill";

type BillViewRow = {
  readonly bill: Bill;
  readonly billPayment: BillPayment | null;
  readonly status: "pending" | "paid" | "overdue";
  readonly dueDate: string | null;
  readonly amount: number;
  readonly paidAt: string | null;
};

type ViewBillSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly row: BillViewRow | null;
  readonly onPay?: () => void;
  readonly onEdit?: () => void;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getStatusConfig(status: BillViewRow["status"]): {
  readonly label: string;
  readonly variant: "success" | "warning" | "error";
} {
  switch (status) {
    case "paid":
      return { label: "Pagado", variant: "success" };
    case "overdue":
      return { label: "Vencido", variant: "error" };
    case "pending":
    default:
      return { label: "Pendiente", variant: "warning" };
  }
}

function DetailItem({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}): JSX.Element {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3">
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{value || "—"}</p>
    </div>
  );
}

export default function ViewBillSheet({
  open,
  onClose,
  row,
  onPay,
  onEdit,
}: ViewBillSheetProps): JSX.Element {
  const statusConfig = row ? getStatusConfig(row.status) : null;

  return (
    <Modal open={open} onClose={onClose} title="Detalle del impuesto">
      {!row ? (
        <p className="text-sm text-muted-foreground">
          No seleccionaste ningún impuesto.
        </p>
      ) : (
        <div className="space-y-4">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-foreground">
                  {row.bill?.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {row.bill?.account?.name ?? "Sin cuenta asociada"}
                </p>
              </div>

              {statusConfig ? (
                <Badge tone={statusConfig.variant}>
                  {statusConfig.label}
                </Badge>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                label="Monto del mes"
                value={formatCurrency(row.amount)}
              />
              <DetailItem
                label="Vencimiento"
                value={formatDate(row.dueDate)}
              />
              <DetailItem
                label="Fecha de pago"
                value={formatDate(row.paidAt)}
              />
              <DetailItem
                label="Vencimiento habitual"
                value={row.bill?.due_day ? String(row.bill?.due_day) : "—"}
              />
              <DetailItem
                label="Número de cliente"
                value={row.bill?.customer_number ?? "—"}
              />
              <DetailItem
                label="Monto estimado"
                value={
                  row.bill?.default_amount !== null &&
                    row.bill?.default_amount !== undefined
                    ? formatCurrency(Number(row.bill?.default_amount))
                    : "—"
                }
              />
            </div>
          </section>

          {(row.bill?.notes || row.bill?.url || row.bill?.logo) && (
            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Información adicional
              </h3>
              <div className="space-y-3">
                {row.bill?.notes ? (
                  <DetailItem label="Notas" value={row.bill?.notes} />
                ) : null}

                {row.bill?.url ? (
                  <DetailItem label="URL" value={row.bill?.url} />
                ) : null}

                {row.bill?.logo ? (
                  <DetailItem label="Logo" value={row.bill?.logo} />
                ) : null}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Pago del período
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                label="Estado"
                value={statusConfig?.label ?? "—"}
              />
              <DetailItem
                label="Monto esperado"
                value={
                  row.billPayment?.expected_amount !== null &&
                    row.billPayment?.expected_amount !== undefined
                    ? formatCurrency(Number(row.billPayment.expected_amount))
                    : "—"
                }
              />
              <DetailItem
                label="Monto pagado"
                value={
                  row.billPayment?.paid_amount !== null &&
                    row.billPayment?.paid_amount !== undefined
                    ? formatCurrency(Number(row.billPayment.paid_amount))
                    : "—"
                }
              />
              <DetailItem
                label="Transacción asociada"
                value={row.billPayment?.transaction_id ? "Sí" : "No"}
              />
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            {row.status !== "paid" && onPay ? (
              <Button onClick={onPay}>Pagar</Button>
            ) : null}

            {onEdit ? (
              <Button variant="ghost" onClick={onEdit}>
                Editar
              </Button>
            ) : null}

            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}