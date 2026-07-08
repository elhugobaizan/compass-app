import { JSX } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Account } from "@/types/account";
import Button from "@/components/ui/Button";
import AccountCard, { AccountType } from "./AccountCard";

function mapAccountType(accountType: string): AccountType {
  switch (accountType) {
    case "BANK":
    case "WALLET":
    case "BROKER":
      return accountType;
    default:
      return "BANK";
  }
}

type AccountListItemProps = {
  readonly account: Account;
  readonly balance?: number;
  readonly compact?: boolean;
  readonly onEdit: (account: Account) => void;
  readonly onDelete: (account: Account) => void;
  readonly onSelect?: (account: Account) => void;
};

export function AccountListItem({
  account,
  balance,
  compact = false,
  onEdit,
  onDelete,
  onSelect,
}: AccountListItemProps): JSX.Element {
  const displayBalance = balance ?? account.opening_balance ?? "-";

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(account)}
        className="block w-full text-left"
      >
        <AccountCard
          name={account.name}
          institution={account.institution}
          currency={account.currency}
          accountType={mapAccountType(account.account_type)}
          balance={displayBalance}
          isPaymentMethod={account.is_payment_method}
          compact
        />
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_1px_4px_rgba(46,42,36,0.04)]">
      <button
        type="button"
        onClick={() => onSelect?.(account)}
        className="block w-full text-left transition-colors hover:bg-[var(--color-paper)]"
      >
        <AccountCard
          name={account.name}
          institution={account.institution}
          currency={account.currency}
          accountType={mapAccountType(account.account_type)}
          balance={displayBalance}
          isPaymentMethod={account.is_payment_method}
          unstyled
        />
      </button>

      <div className="border-t border-[var(--color-border)] bg-[var(--color-paper)]">
        <div className="flex items-center justify-end gap-2 px-4 py-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(account)}
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Editar
          </Button>

          <Button
            variant="danger-ghost"
            size="sm"
            onClick={() => onDelete(account)}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}