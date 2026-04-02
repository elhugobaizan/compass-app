import { JSX } from "react";
import { Pencil, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import type { TransactionListItem as TransactionListItemType } from "@/types/transactionList";

import TransactionCard from "./TransactionCard";
import TransferCard from "./TransferCard";

type BaseItemProps = {
  readonly isMobile: boolean;
};

type RegularTransactionItemProps = BaseItemProps & {
  readonly kind: "transaction";
  readonly concept?: string | null;
  readonly amount: string | number;
  readonly date: string;
  readonly typeLabel?: string;
  readonly categoryLabel?: string;
  readonly location?: string | null;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
};

type TransferTransactionItemProps = BaseItemProps & {
  readonly kind: "transfer";
  readonly item: Extract<TransactionListItemType, { kind: "transfer" }>;
  readonly onEdit?: (
    item: Extract<TransactionListItemType, { kind: "transfer" }>,
  ) => void;
  readonly onDelete?: (
    item: Extract<TransactionListItemType, { kind: "transfer" }>,
  ) => void;
};

type TransactionListItemProps =
  | RegularTransactionItemProps
  | TransferTransactionItemProps;

function TransactionActions({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: {
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
  readonly editLabel: string;
  readonly deleteLabel: string;
}): JSX.Element | null {
  if (!onEdit && !onDelete) return null;

  return (
    <div className="mt-0 flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/80 px-4 py-3">
      {onEdit && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onEdit}
          aria-label={editLabel}
        >
          <Pencil className="mr-1 h-3.5 w-3.5" />
          Editar
        </Button>
      )}

      {onDelete && (
        <Button
          variant="danger-ghost"
          size="sm"
          onClick={onDelete}
          aria-label={deleteLabel}
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Eliminar
        </Button>
      )}
    </div>
  );
}

function DesktopItemFrame({
  children,
}: {
  readonly children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow">
      {children}
    </div>
  );
}

export default function TransactionListItem(
  props: TransactionListItemProps,
): JSX.Element {
  if (props.kind === "transaction") {
    if (props.isMobile) {
      return (
        <DesktopItemFrame>
          <TransactionCard
            concept={props.concept}
            amount={props.amount}
            date={props.date}
            typeLabel={props.typeLabel}
            categoryLabel={props.categoryLabel}
            location={props.location}
          />
        </DesktopItemFrame>
      );
    }

    return (
      <DesktopItemFrame>
        <TransactionCard
          concept={props.concept}
          amount={props.amount}
          date={props.date}
          typeLabel={props.typeLabel}
          categoryLabel={props.categoryLabel}
          location={props.location}
        />

        <TransactionActions
          onEdit={props.onEdit}
          onDelete={props.onDelete}
          editLabel="Editar movimiento"
          deleteLabel="Eliminar movimiento"
        />
      </DesktopItemFrame>
    );
  }

  const handleEdit = props.onEdit
    ? () => props.onEdit(props.item)
    : undefined;

  const handleDelete = props.onDelete
    ? () => props.onDelete(props.item)
    : undefined;

  if (props.isMobile) {
    return (
      <DesktopItemFrame>
        <TransferCard item={props.item} />
      </DesktopItemFrame>
    );
  }

  return (
    <DesktopItemFrame>
      <TransferCard item={props.item} />

      <TransactionActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        editLabel="Editar transferencia"
        deleteLabel="Eliminar transferencia"
      />
    </DesktopItemFrame>
  );
}