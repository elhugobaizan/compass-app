import { JSX } from "react";
import Card from "../ui/Card";
import StatRow from "../ui/StatRow";

type AccountCardProps = {
  readonly name: string;
  readonly institution?: string | null;
  readonly currency: string;
  readonly accountType: string;
  readonly accountGroup?: string;
  readonly balance?: string | number;
  readonly isPaymentMethod?: boolean;
};

export default function AccountCard({
  name,
  institution,
  currency,
  accountType,
  accountGroup,
  balance,
  isPaymentMethod = false,
}: AccountCardProps): JSX.Element {
  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-900">
            {name}
          </h3>

          {institution && (
            <p className="mt-1 text-sm text-gray-500">{institution}</p>
          )}
        </div>

        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          {currency}
        </span>
      </div>

      <div className="space-y-2">
        <StatRow label="Tipo" value={accountType} muted />
        {accountGroup && <StatRow label="Grupo" value={accountGroup} muted />}
        {isPaymentMethod && <StatRow label="Uso" value="Método de pago" muted />}
      </div>

      {balance !== undefined && balance !== null && (
        <div className="border-t border-gray-100 pt-3">
          <StatRow label="Saldo" value={balance} />
        </div>
      )}
    </Card>
  );
}