import { JSX, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";
import { useBreakpoint } from "@/utils/utils";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { toNumber } from "@/utils/numbers";
import CreateTransactionSheet from "@/components/finance/CreateTransactionSheet";
import CreateAssetSheet from "@/components/finance/CreateAssetSheet";
import CreateAccountSheet from "@/components/finance/CreateAccountSheet";

import SummarySection from "./sections/SummarySection";
import AccountsSection from "./sections/AccountsSection";
import ActivitySection from "./sections/ActivitySection";
import Button from "@/components/ui/Button";
import CreateTransferSheet from "@/components/finance/CreateTransferSheet";
import MonthlyHighlightsSection from "@/components/finance/MonthlyHighlightsSection";
import { useMonthlyHighlights } from "@/hooks/useMonthlyHighlights";
import { useMonthlySnapshot } from "@/hooks/useMonthlySnapshot";
import { useDollarRate } from "@/hooks/queries/useDollarRate";
import DollarRateChip from "@/components/finance/DollarRateChip";

export default function Dashboard(): JSX.Element {
  const { isMobile } = useBreakpoint();
  const {
    accounts,
    transactions,
    summary,
    snapshots,
    assets,
    settings,
    hasAccounts,
    hasTransactions,
    hasFinancialData,
    isLoadingAccounts,
    isLoadingTransactions,
    isLoadingSnapshots,
    isLoadingAssets,
    isLoadingSettings,
    isErrorAccounts,
    isErrorTransactions,
    isErrorSnapshots,
  } = useDashboardData();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories
  } = useCategoriesQuery();
  

  const salary = useMemo(() => {
    const setting = settings?.find((s) => s.key === "sueldo");
    const value = setting?.value;
    return value ? toNumber(value) : undefined;
  }, [settings]);

  const reserve = useMemo(() => {
    const setting = settings?.find((s) => s.key === "reserva");
    const value = setting?.value;
    return value ? toNumber(value) : undefined;
  }, [settings]);

  const highlights = useMonthlyHighlights(
    summary.liquidity,
    transactions,
    assets,
    salary,
  );

  const { data: dollarRate, isLoading: isLoadingDollar } = useDollarRate();

  const isSnapshotReady =
    !isLoadingAccounts &&
    !isLoadingAssets &&
    !isLoadingSnapshots &&
    !isLoadingSettings &&
    !isLoadingDollar &&
    !isErrorAccounts &&
    !isErrorSnapshots &&
    hasAccounts;

  useMonthlySnapshot({
    snapshots,
    summary,
    exchangeRate: dollarRate?.venta,
    isReady: isSnapshotReady,
  });

  const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false);
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isCreateTransferOpen, setIsCreateTransferOpen] = useState(false);

  const isLoadingSummary =
    isLoadingAccounts || 
    isLoadingTransactions || 
    isLoadingSnapshots ||
    isLoadingAssets ||
    isLoadingSettings;

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <DollarRateChip />

        {!isMobile && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsCreateAccountOpen(true)}>
              + Cuenta
            </Button>

            <Button variant="secondary" onClick={() => setIsCreateAssetOpen(true)}>
              + Asset
            </Button>

            <Button onClick={() => setIsCreateTransferOpen(true)}>
              + Transferencia
            </Button>

            <Button onClick={() => setIsCreateTransactionOpen(true)}>
              + Movimiento
            </Button>
          </div>
        )}
      </div>

      <MonthlyHighlightsSection highlights={highlights} />

      <SummarySection
        isMobile={isMobile}
        isLoading={isLoadingSummary}
        hasFinancialData={hasFinancialData}
        hasAccounts={hasAccounts}
        hasTransactions={hasTransactions}
        reserve={reserve}
        summary={summary}
      />

      <ActivitySection
        isMobile={isMobile}
        transactions={transactions}
        isLoading={isLoadingTransactions}
        isError={isErrorTransactions}
        snapshots={snapshots}
        isLoadingSnapshots={isLoadingSnapshots}
        isErrorSnapshots={isErrorSnapshots}
      />

      <AccountsSection
        isMobile={isMobile}
        accounts={accounts}
        transactions={transactions}
        isLoading={isLoadingAccounts}
        isError={isErrorAccounts}
      />

      {isMobile && (
        <button
          type="button"
          aria-label="Registrar movimiento"
          onClick={() => setIsCreateTransactionOpen(true)}
          className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-contrast)] shadow-lg transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      <CreateTransactionSheet
        open={isCreateTransactionOpen}
        onClose={() => setIsCreateTransactionOpen(false)}
        accounts={accounts}
        categories={categories}
        isLoadingAccounts={isLoadingAccounts}
        isLoadingCategories={isLoadingCategories}
        isErrorAccounts={isErrorAccounts}
        isErrorCategories={isErrorCategories}
      />

      <CreateAssetSheet
        open={isCreateAssetOpen}
        onClose={() => setIsCreateAssetOpen(false)}
        accounts={accounts}
        isLoadingAccounts={isLoadingAccounts}
        isErrorAccounts={isErrorAccounts}
      />

      <CreateAccountSheet
        open={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
      />

      <CreateTransferSheet 
        open={isCreateTransferOpen}
        onClose={() => setIsCreateTransferOpen(false)}
        accounts={accounts}
        isErrorAccounts={isErrorAccounts}
        isLoadingAccounts={isLoadingAccounts}
      />
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}