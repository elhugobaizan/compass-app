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
  readonly compact?: boolean;
  readonly onEdit: (account: Account) => void;
  readonly onDelete: (account: Account) => void;
};

export function AccountListItem({
  account,
  compact = false,
  onEdit,
  onDelete,
}: AccountListItemProps): JSX.Element {
  if (compact) {
    return (
      <AccountCard
        name={account.name}
        institution={account.institution}
        currency={account.currency}
        accountType={mapAccountType(account.account_type)}
        balance={account.opening_balance ?? "-"}
        isPaymentMethod={account.is_payment_method}
        compact
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <AccountCard
        name={account.name}
        institution={account.institution}
        currency={account.currency}
        accountType={mapAccountType(account.account_type)}
        balance={account.opening_balance ?? "-"}
        isPaymentMethod={account.is_payment_method}
        unstyled
      />

      <div className="border-t border-gray-100 bg-gray-50/80">
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