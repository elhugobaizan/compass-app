import { JSX } from "react";
import { Landmark, Wallet, LineChart, LucideIcon } from "lucide-react";

import Card from "../../ui/Card";
import { formatCurrency } from "@/utils/formatters";
import Badge from "@/components/ui/Badge";

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

type AssetVisualConfig = {
  readonly label: string;
  readonly Icon: LucideIcon;
  readonly containerClassName: string;
  readonly iconClassName: string;
};

function getAccountVisualConfig(assetType: string): AssetVisualConfig {
  switch (assetType) {
    case "BANK":
      return {
        label: "Banco",
        Icon: Landmark,
        containerClassName: "bg-amber-50 border border-amber-100",
        iconClassName: "text-amber-600",
      };

    case "WALLET":
      return {
        label: "Billetera virtual",
        Icon: Wallet,
        containerClassName: "bg-sky-50 border border-sky-100",
        iconClassName: "text-sky-700",
      };

    case "BROKER":
      return {
        label: "Broker",
        Icon: LineChart,
        containerClassName: "bg-violet-50 border border-violet-100",
        iconClassName: "text-violet-700",
      };

    default:
      return {
        label: assetType,
        Icon: Wallet,
        containerClassName: "bg-gray-50 border border-gray-100",
        iconClassName: "text-gray-600",
      };
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
  const visual = getAccountVisualConfig(accountType);
  const { Icon } = visual;
  const formattedBalance =
    typeof balance === "number" ? formatCurrency(balance) : balance;

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={
              compact
                ? `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${visual.containerClassName}`
                : `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${visual.containerClassName}`
            }
          >
            <Icon className={`h-4 w-4 ${visual.iconClassName}`} />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {name}
              </h3>

              {isPaymentMethod && (
                <Badge tone="success">
                  Método de pago
                </Badge>
              )}
            </div>

            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 sm:text-sm">
              {institution && <span className="truncate">{institution}</span>}
              {institution && <span className="text-gray-300">•</span>}
              <span>{visual.label}</span>
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
    <Card className={compact ? "rounded-xl p-3 my-3" : "rounded-xl p-4"}>
      {content}
    </Card>
  );
}