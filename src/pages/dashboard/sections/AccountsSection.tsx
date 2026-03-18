import { JSX } from "react";
import SectionBlock from "@/components/ui/SectionBlock";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import AccountCard from "@/components/finance/AccountCard";
import type { Account } from "@/types/account";
import type { Transaction } from "@/types/transaction";
import { accountGroupLabels } from "@/utils/accountGroups";
import { getMostUsedAccounts } from "@/utils/accounts";

type AccountsSectionProps = {
  readonly isMobile: boolean;
  readonly accounts?: Account[];
  readonly transactions?: Transaction[];
  readonly isLoading: boolean;
  readonly isError: boolean;
};

export default function AccountsSection({
  isMobile,
  accounts,
  transactions,
  isLoading,
  isError,
}: AccountsSectionProps): JSX.Element {
  const visibleAccounts = getMostUsedAccounts(
    accounts ?? [],
    transactions ?? [],
    3
  );

  return (
    <SectionBlock
      title="Cuentas"
      subtitle={isMobile ? undefined : "Wallets, bancos y brokers"}
      action={<Button disabled>Ver todas</Button>}
    >
      {isLoading && <p className="text-sm text-gray-500">Cargando cuentas...</p>}

      {isError && (
        <EmptyState
          title="No pudimos cargar las cuentas"
          description="Revisá el backend o la conexión e intentá de nuevo."
          variant="error"
        />
      )}

      {!isLoading && !isError && accounts?.length === 0 && (
        <EmptyState
          title="No tenés cuentas cargadas"
          description="Cuando agregues cuentas, las vas a ver acá."
        />
      )}

      {!isLoading && !isError && visibleAccounts.length > 0 && (
        <div className={isMobile ? "space-y-4" : "grid grid-cols-2 xl:grid-cols-3 gap-6"}>
          {visibleAccounts.map((account) => (
            <AccountCard
              key={account.id}
              name={account.name}
              institution={account.institution}
              currency={account.currency}
              accountType={account.account_type}
              accountGroup={accountGroupLabels[account.account_group.name] ?? "UNKNOWN"}
              balance={account.opening_balance ?? "-"}
              isPaymentMethod={account.is_payment_method}
            />
          ))}
        </div>
      )}
    </SectionBlock>
  );
}