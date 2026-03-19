import { JSX, useMemo, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import CreateAssetSheet from "@/components/finance/CreateAssetSheet";
import AssetRow from "@/components/finance/AssetRow";

import { useBreakpoint } from "@/utils/utils";
import { useAssetsQuery } from "@/hooks/queries/useAssetsQuery";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";

import type { Asset } from "@/types/asset";
import type { Account } from "@/types/account";
import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";

function sortAssets(assets: Asset[] = []): Asset[] {
  return [...assets].sort((a, b) => a.name.localeCompare(b.name));
}

function buildAccountMap(accounts: Account[] = []): Record<string, string> {
  return accounts.reduce<Record<string, string>>((acc, account) => {
    acc[account.id] = account.name;
    return acc;
  }, {});
}

export default function AssetsPage(): JSX.Element {
  const { isMobile } = useBreakpoint();
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);

  const {
    data: assets,
    isLoading: isLoadingAssets,
    isError: isErrorAssets,
  } = useAssetsQuery();

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
  } = useAccountsQuery();

  const sortedAssets = useMemo(() => sortAssets(assets ?? []), [assets]);
  const accountMap = useMemo(() => buildAccountMap(accounts ?? []), [accounts]);

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title="Assets"
        description={
          isMobile ? undefined : "Consultá y cargá cripto, acciones y plazos fijos"
        }
        action={
          <Button onClick={() => setIsCreateAssetOpen(true)}>+ Asset</Button>
        }
      />

      {isLoadingAssets && (
        <p className="text-sm text-gray-500">Cargando assets...</p>
      )}

      {isErrorAssets && (
        <EmptyState
          title="No pudimos cargar los assets"
          description="Revisá el backend o la conexión e intentá de nuevo."
          variant="error"
        />
      )}

      {!isLoadingAssets && !isErrorAssets && sortedAssets.length === 0 && (
        <EmptyState
          title="Todavía no hay assets"
          description="Creá tu primer asset para empezar a poblar la app."
          action={
            <Button onClick={() => setIsCreateAssetOpen(true)}>
              Crear asset
            </Button>
          }
        />
      )}

      {!isLoadingAssets && !isErrorAssets && sortedAssets.length > 0 && (
        <div className="space-y-3">
          {sortedAssets.map((asset) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              accountName={accountMap[asset.account_id]}
            />
          ))}
        </div>
      )}

      <CreateAssetSheet
        open={isCreateAssetOpen}
        onClose={() => setIsCreateAssetOpen(false)}
        accounts={accounts}
        isLoadingAccounts={isLoadingAccounts}
        isErrorAccounts={isErrorAccounts}
      />
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}