import { JSX, useMemo } from "react";

import Button from "@/components/ui/Button";
import Badge, { BadgeTone } from "@/components/ui/Badge";
import { parseLocalDate } from "@/utils/date";

type BillListItemProps = {
  readonly name: string;
  readonly customerNumber?: string | null;
  readonly dueDate?: string | null;
  readonly amount: number;
  readonly status: "paid" | "pending" | "overdue";
  readonly paidAt?: string | null;
  readonly accountName?: string | null;
  readonly onClick?: () => void;
  readonly onPay?: () => void;
  readonly onView?: () => void;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date | null): string | null {
  if (!date) return null;

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getRelativeDueText(
  dueDate: string | null | undefined,
  status: BillListItemProps["status"],
): string | null {
  if (!dueDate || status === "paid") return null;

  const due = parseLocalDate(dueDate);
  if (Number.isNaN(due.getTime())) return null;

  const today = new Date();
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const dueOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffInMs = dueOnly.getTime() - todayOnly.getTime();
  const diffInDays = Math.round(diffInMs / 86_400_000);

  if (diffInDays === 0) return "Vence hoy";
  if (diffInDays === 1) return "Vence mañana";
  if (diffInDays > 1) return `Vence en ${diffInDays} días`;
  if (diffInDays === -1) return "Venció ayer";

  return `Venció hace ${Math.abs(diffInDays)} días`;
}

function getStatusConfig(status: BillListItemProps["status"]): {
  label: string;
  variant: BadgeTone;
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

export default function BillListItem({
  name,
  customerNumber,
  dueDate,
  amount,
  status,
  paidAt,
  accountName,
  onClick,
  onPay,
  onView,
  onEdit,
  onDelete,
}: BillListItemProps): JSX.Element {
  const formattedDueDate = useMemo(() => dueDate ? formatDate(parseLocalDate(dueDate)) : null, [dueDate]);
  const formattedPaidAt = useMemo(() => paidAt ? formatDate(parseLocalDate(paidAt)) : null, [paidAt]);
  const relativeDueText = useMemo(
    () => getRelativeDueText(dueDate, status),
    [dueDate, status],
  );

  const statusConfig = useMemo(() => getStatusConfig(status), [status]);

  const secondaryLine = useMemo(() => {
    const parts: string[] = [];

    if (customerNumber) {
      parts.push(`Cliente ${customerNumber}`);
    }

    if (accountName) {
      parts.push(accountName);
    }

    return parts.join(" • ");
  }, [accountName, customerNumber]);

  const dueLabel =
    status === "paid"
      ? formattedPaidAt
        ? `Pagado el ${formattedPaidAt}`
        : "Pago registrado"
      : formattedDueDate
        ? `Vence ${formattedDueDate}`
        : "Sin vencimiento";

  return (
    <article
      className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-border/80"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        onClick();
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">
              {name}
            </h3>

            <Badge tone={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>

          {secondaryLine ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {secondaryLine}
            </p>
          ) : null}

          <div className="mt-3 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">{dueLabel}</p>

            {relativeDueText ? (
              <p
                className={
                  status === "overdue"
                    ? "text-sm font-medium text-destructive"
                    : "text-sm text-muted-foreground"
                }
              >
                {relativeDueText}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-55 lg:items-end">
          <div className="flex flex-col lg:items-end">
            <p className="text-sm text-muted-foreground">Monto</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(amount)}
            </p>
          </div>

          <div
            className="flex flex-wrap gap-2"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {status === "paid" ? (
              <Button variant="ghost" size="sm" onClick={onView}>
                Ver
              </Button>
            ) : (
              <Button size="sm" onClick={onPay}>
                Pagar
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={onEdit}>
              Editar
            </Button>

            <Button variant="ghost" size="sm" onClick={onDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}