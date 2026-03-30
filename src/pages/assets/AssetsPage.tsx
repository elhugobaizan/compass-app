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
import { isTodayDateString } from "@/utils/date";
import { getAssetNumericValue, getAssetsDueInNextDays, sortAssetsByPriority } from "@/utils/assets";
import AssetSummary from "@/components/finance/assets/AssetSummary";
import { formatCurrency } from "@/utils/formatters";

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
  const [highlightedAssetId, setHighlightedAssetId] = useState<string | null>(null);

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

  const sortedAssets = useMemo(() => sortAssetsByPriority(assets ?? []), [assets]);
  const accountMap = useMemo(() => buildAccountMap(accounts ?? []), [accounts]);
  const assetsDueToday = useMemo(() => 
    sortedAssets.filter((asset) => isTodayDateString(asset.maturity))
  , [sortedAssets]);  

  async function handleConfirmDelete() {
    if (!assetToDelete) return;

    await deleteAsset(assetToDelete.id);
    setAssetToDelete(null);
  }

  const totalAssets = sortedAssets.length;

  const totalValue = useMemo(() => {
    return sortedAssets.reduce((sum, asset) => {
      return sum + getAssetNumericValue(asset);
    }, 0);
  }, [sortedAssets]);

  const totalValueLabel = useMemo(() => {
    return formatCurrency(totalValue);
  }, [totalValue]);

  const assetsWithMaturity = useMemo(() => {
    return getAssetsDueInNextDays(sortedAssets, 7);
  }, [sortedAssets]);

  const listClassName = isMobile ? "space-y-3" : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3";
  const firstDueTodayAsset = assetsDueToday[0] ?? null;

  function handleScrollToDueToday() {
    if (!firstDueTodayAsset) return;
  
    setHighlightedAssetId(firstDueTodayAsset.id);
  
    document.getElementById("due-today-anchor")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  
    globalThis.setTimeout(() => {
      setHighlightedAssetId((currentId) =>
        currentId === firstDueTodayAsset.id ? null : currentId,
      );
    }, 2000);
  }

  const content = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      <PageHeader
        title={isMobile ? "Inversiones" : ""}
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
              description={assetsDueToday.length === 1
                ? "Revisá el activo que vence hoy para decidir si renovarlo, retirarlo o reasignarlo."
                : "Revisá los activos que vencen hoy para decidir si renovarlos, retirarlos o reasignarlos."
              }
              action={<Button 
                variant='ghost'
                size='sm'
                className="text-amber-600!"
                onClick={handleScrollToDueToday}
              >Ver</Button>}
            />
          ) : undefined
        }
        summary={
          (sortedAssets.length > 0 && !isMobile) ? (
            <AssetSummary
              totalValueLabel={totalValueLabel}
              assetsWithMaturity={assetsWithMaturity}
              totalAssets={totalAssets}
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
        <div className={listClassName}>
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
        <div className={listClassName}>
          {sortedAssets.map((asset) => (
            <AssetListItem
              key={asset.id}
              asset={asset}
              isMobile={isMobile}
              accountName={accountMap[asset.account_id]}
              onEdit={() => setAssetToEdit(asset)}
              onDelete={() => setAssetToDelete(asset)}
              id={asset.id === firstDueTodayAsset?.id ? "due-today-anchor" : undefined}
              isHighlighted={asset.id === highlightedAssetId}
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