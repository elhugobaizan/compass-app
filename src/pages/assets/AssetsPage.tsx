import { JSX, useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import CreateAssetSheet from "@/components/finance/CreateAssetSheet";
import EditAssetSheet from "@/components/finance/EditAssetSheet";
import { AssetListItem } from "@/components/finance/assets/AssetListItem";
import AssetCardSkeleton from "@/components/finance/assets/AssetCardSkeleton";

import LayoutMobile from "@/layouts/LayoutMobile";
import LayoutWeb from "@/layouts/LayoutWeb";

import { useBreakpoint } from "@/utils/utils";
import { useAssetsQuery } from "@/hooks/queries/useAssetsQuery";
import { useAccountsQuery } from "@/hooks/queries/useAccountsQuery";
import { useDeleteAsset } from "@/hooks/mutations/useDeleteAsset";

import type { Asset } from "@/types/asset";
import type { Account } from "@/types/account";
import HeaderAlert from "@/components/ui/HeaderAlert";
import { parseLocalDate } from "@/utils/date";

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
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);

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

  const { mutateAsync: deleteAsset, isPending: isDeleting } = useDeleteAsset();

  const sortedAssets = useMemo(() => sortAssets(assets ?? []), [assets]);
  const accountMap = useMemo(() => buildAccountMap(accounts ?? []), [accounts]);
  const assetsDueToday = useMemo(() => {
    return sortedAssets.filter((asset) => {
      if (!asset.maturity) return false;
  
      const today = new Date();
      const maturityDate = parseLocalDate(asset.maturity) ?? null;
      if(!maturityDate) return false;
      return (
        maturityDate.getFullYear() === today.getFullYear() &&
        maturityDate.getMonth() === today.getMonth() &&
        maturityDate.getDate() === today.getDate()
      );
    });
  }, [sortedAssets]);  

  async function handleConfirmDelete() {
    if (!assetToDelete) return;

    await deleteAsset(assetToDelete.id);
    setAssetToDelete(null);
  }

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title="Assets"
        description={
          isMobile ? undefined : "Consultá y cargá cripto, acciones y plazos fijos"
        }
        alert={
          assetsDueToday.length > 0 ? (
            <HeaderAlert
              title={
                assetsDueToday.length === 1
                  ? "Vence un activo hoy"
                  : `Vencen ${assetsDueToday.length} activos hoy`
              }
              description="Revisalos para decidir si renovarlos, retirarlos o reasignarlos."
            />
          ) : undefined
        }
        action={
          <Button onClick={() => setIsCreateAssetOpen(true)}>
            Crear asset
          </Button>
        }
      />

      {isLoadingAssets && (
        <div className="space-y-3">
          <AssetCardSkeleton />
          <AssetCardSkeleton />
          <AssetCardSkeleton />
        </div>
      )}

      {isErrorAssets && (
        <EmptyState
          title="No pudimos cargar los assets"
          description="Revisá la conexión o el backend e intentá nuevamente."
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
            <AssetListItem
              key={asset.id}
              asset={asset}
              accountName={accountMap[asset.account_id]}
              onEdit={() => setAssetToEdit(asset)}
              onDelete={() => setAssetToDelete(asset)}
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

      <EditAssetSheet
        open={!!assetToEdit}
        onClose={() => setAssetToEdit(null)}
        asset={assetToEdit}
        accounts={accounts}
        isLoadingAccounts={isLoadingAccounts}
        isErrorAccounts={isErrorAccounts}
      />

      <ConfirmDialog
        open={!!assetToDelete}
        title="Eliminar activo"
        description="Esta acción quitará el activo del listado y actualizará el resumen."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        confirmVariant="danger"
        isLoading={isDeleting}
        onClose={() => setAssetToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );

  return isMobile ? (
    <LayoutMobile>{content}</LayoutMobile>
  ) : (
    <LayoutWeb>{content}</LayoutWeb>
  );
}