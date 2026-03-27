import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import type { Account } from "@/types/account";
import type { Asset } from "@/types/asset";
import AssetForm from "./assets/AssetForm";

type EditAssetSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly asset?: Asset | null;
  readonly accounts?: Account[];
  readonly isLoadingAccounts?: boolean;
  readonly isErrorAccounts?: boolean;
};

export default function EditAssetSheet({
  open,
  onClose,
  asset,
  accounts = [],
  isLoadingAccounts = false,
  isErrorAccounts = false,
}: EditAssetSheetProps): JSX.Element {
  const isLoading = isLoadingAccounts;
  const isError = isErrorAccounts;

  return (
    <Modal open={open} onClose={onClose} title="Editar activo">
      {isLoading && (
        <p className="text-sm text-gray-500">Cargando datos del formulario...</p>
      )}

      {isError && (
        <EmptyState
          title="No pudimos cargar el formulario"
          description="Revisá la conexión o el backend e intentá de nuevo."
          variant="error"
        />
      )}

      {!isLoading && !isError && !asset && (
        <EmptyState
          title="No encontramos el activo"
          description="Probá cerrando e intentando de nuevo."
          variant="error"
        />
      )}

      {!isLoading && !isError && asset && accounts.length > 0 && (
        <AssetForm
          mode="edit"
          assetId={asset.id}
          accounts={accounts}
          initialValues={{
            capital: asset.capital ?? "",
            account_id: asset.account_id,
            asset_type: asset.asset_type,
            interest: asset.interest ?? "",
            maturity: asset.maturity ?? "",
            name: asset.name,
            price: asset.price ?? "",
            quantity: asset.quantity ?? "",
            start_date: asset.start_date,
            symbol: asset.symbol ?? "",
          }}
          onSuccess={onClose}
        />
      )}
    </Modal>
  );
}