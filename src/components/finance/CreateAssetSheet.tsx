import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import AssetForm from "@/components/finance/assets/AssetForm";
import type { Account } from "@/types/account";

type CreateAssetSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly accounts?: Account[];
  readonly isLoadingAccounts?: boolean;
  readonly isErrorAccounts?: boolean;
};

export default function CreateAssetSheet({
  open,
  onClose,
  accounts = [],
  isLoadingAccounts = false,
  isErrorAccounts = false,
}: CreateAssetSheetProps): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} title="Nuevo asset">
      {isLoadingAccounts && (
        <p className="text-sm text-gray-500">Cargando cuentas...</p>
      )}

      {isErrorAccounts && (
        <EmptyState
          title="No pudimos cargar el formulario"
          description="Revisá la conexión o el backend e intentá de nuevo."
          variant="error"
        />
      )}

      {!isLoadingAccounts && !isErrorAccounts && accounts.length === 0 && (
        <EmptyState
          title="No hay cuentas disponibles"
          description="Necesitás al menos una cuenta para registrar un asset."
        />
      )}

      {!isLoadingAccounts && !isErrorAccounts && accounts.length > 0 && (
        <AssetForm accounts={accounts} onSuccess={onClose} />
      )}
    </Modal>
  );
}