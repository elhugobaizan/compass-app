import { JSX, useMemo } from "react";

import Badge, { BadgeTone } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { parseLocalDate } from "@/utils/date";
import { formatCurrency } from "@/utils/formatters";

type BillCardProps = {
  readonly name: string;
  readonly customerNumber?: string | null;
  readonly dueDate?: string | null;
  readonly amount: number;
  readonly status: "paid" | "pending" | "overdue";
  readonly paidAt?: string | null;
  readonly accountName?: string | null;
  readonly compact?: boolean;
  readonly unstyled?: boolean;
};

function getRelativeDueText(
  dueDate: string | null | undefined,
  status: BillCardProps["status"],
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

function getStatusConfig(status: BillCardProps["status"]): {
  readonly label: string;
  readonly variant: BadgeTone;
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

function getBillInitials(name: string): string {
  const trimmedName = name.trim();
  if (!trimmedName) return "BI";

  const words = trimmedName.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}


function formatDate(date: Date | null): string | null {
  if (!date) return null;

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function BillCard({
  name,
  customerNumber,
  dueDate,
  amount,
  status,
  paidAt,
  accountName,
  compact = false,
  unstyled = false,
}: BillCardProps): JSX.Element {
  const formattedDueDate = useMemo(
    () => (dueDate ? dueDate : null),
    [dueDate],
  );

  const formattedPaidAt = useMemo(
    () => (paidAt ? formatDate(parseLocalDate(paidAt)) : null),
    [paidAt],
  );

  const relativeDueText = useMemo(
    () => getRelativeDueText(dueDate, status),
    [dueDate, status],
  );

  const statusConfig = useMemo(() => getStatusConfig(status), [status]);

  const secondaryLine = useMemo(() => {
    const parts: string[] = [];

    if (accountName) {
      parts.push(accountName);
    }

    if (customerNumber) {
      parts.push(`Cliente ${customerNumber}`);
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

  const initials = useMemo(() => getBillInitials(name), [name]);

  const content = (
    <div className={compact ? "p-3" : "p-4"}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-sm font-semibold text-amber-700">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
              {name}
            </h3>

            {secondaryLine ? (
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {secondaryLine}
              </p>
            ) : null}

            <div className="mt-3 space-y-1">
              <p className="text-sm text-gray-600">{dueLabel}</p>

              {relativeDueText ? (
                <p
                  className={
                    status === "overdue"
                      ? "text-sm font-medium text-red-600"
                      : "text-sm text-gray-500"
                  }
                >
                  {relativeDueText}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge tone={statusConfig.variant}>{statusConfig.label}</Badge>

          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(amount)}
          </p>
        </div>
      </div>
    </div>
  );

  if (unstyled) {
    return content;
  }

  return <Card className={compact ? "rounded-xl" : "rounded-xl"}>{content}</Card>;
}