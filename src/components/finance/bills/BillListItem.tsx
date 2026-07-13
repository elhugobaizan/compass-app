import { JSX } from "react";
import { Pencil, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import BillCard from "@/components/finance/bills/BillCard";

type BillListItemProps = {
  readonly name: string;
  readonly customerNumber?: string | null;
  readonly dueDate?: string | null;
  readonly amount: number;
  readonly status: "paid" | "pending" | "overdue";
  readonly paidAt?: string | null;
  readonly accountName?: string | null;
  readonly logo?: string | null;
  readonly compact?: boolean;
  readonly onClick?: () => void;
  readonly onPay?: () => void;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
};

export default function BillListItem({
  name,
  customerNumber,
  dueDate,
  amount,
  status,
  paidAt,
  accountName,
  logo,
  compact = false,
  onClick,
  onPay,
  onEdit,
  onDelete,
}: BillListItemProps): JSX.Element {
  if (compact) {
    return (
      <div
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
        <BillCard
          name={name}
          customerNumber={customerNumber}
          dueDate={dueDate}
          amount={amount}
          status={status}
          paidAt={paidAt}
          accountName={accountName}
          logo={logo}
          compact
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_1px_4px_rgba(46,42,36,0.04)]">
      <div
        className="flex-1"
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
        <BillCard
          name={name}
          customerNumber={customerNumber}
          dueDate={dueDate}
          amount={amount}
          status={status}
          paidAt={paidAt}
          accountName={accountName}
          logo={logo}
          unstyled
        />
      </div>

      <div
        className="hidden border-t border-[var(--color-border)] bg-[var(--color-paper)] px-4 py-3 md:block"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex flex-wrap justify-end gap-2">
          {status !== "paid" && onPay ? (
            <Button size="sm" onClick={onPay}>
              Pagar
            </Button>
          ) : null}

          {onEdit ? (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Editar
            </Button>
          ) : null}

          {onDelete ? (
            <Button variant="danger-ghost" size="sm" onClick={onDelete}>
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Eliminar
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}