import { JSX } from "react";
import { Landmark, Wallet, LineChart } from "lucide-react";

import Card from "../ui/Card";
import { formatCurrency } from "@/utils/formatters";

export type AccountType = "BANK" | "WALLET" | "BROKER";

type AccountCardProps = {
  readonly name: string;
  readonly institution?: string | null;
  readonly currency: string;
  readonly accountType: AccountType;
  readonly balance?: number | string;
  readonly isPaymentMethod?: boolean;
  readonly compact?: boolean;
  readonly unstyled?: boolean;
};

function getAccountTypeIcon(accountType: AccountType): JSX.Element {
  const className = "h-4 w-4 text-gray-600";

  switch (accountType) {
    case "BANK":
      return <Landmark className={className} />;
    case "WALLET":
      return <Wallet className={className} />;
    case "BROKER":
      return <LineChart className={className} />;
  }
}

function getAccountTypeLabel(accountType: AccountType): string {
  switch (accountType) {
    case "BANK":
      return "Banco";
    case "WALLET":
      return "Billetera";
    case "BROKER":
      return "Broker";
  }
}

export default function AccountCard({
  name,
  institution,
  currency,
  accountType,
  balance,
  isPaymentMethod = false,
  compact = false,
  unstyled = false,
}: AccountCardProps): JSX.Element {
  const formattedBalance =
    typeof balance === "number" ? formatCurrency(balance) : balance;

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={
              compact
                ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100"
                : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100"
            }
          >
            {getAccountTypeIcon(accountType)}
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {name}
              </h3>

              {isPaymentMethod && (
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  Método de pago
                </span>
              )}
            </div>

            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 sm:text-sm">
              {institution && <span className="truncate">{institution}</span>}
              {institution && <span className="text-gray-300">•</span>}
              <span>{getAccountTypeLabel(accountType)}</span>
            </div>
          </div>
        </div>

        <span className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700 sm:text-xs">
          {currency}
        </span>
      </div>

      {formattedBalance != null && (
        <div
          className={
            compact
              ? "mt-3 border-t border-gray-100 pt-3"
              : "mt-4 border-t border-gray-100 pt-4"
          }
        >
          <div className="flex items-end justify-between gap-3">
            <span className="text-xs text-gray-500">Saldo</span>
            <span
              className={
                compact
                  ? "text-base font-semibold text-gray-900"
                  : "text-lg font-semibold text-gray-900"
              }
            >
              {formattedBalance}
            </span>
          </div>
        </div>
      )}
    </>
  );

  if (unstyled) {
    return <div className={compact ? "p-3" : "p-4"}>{content}</div>;
  }

  return (
    <Card className={compact ? "rounded-xl p-3" : "rounded-xl p-4"}>
      {content}
    </Card>
  );  
}