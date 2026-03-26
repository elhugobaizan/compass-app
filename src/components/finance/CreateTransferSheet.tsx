import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import TransferForm from "@/components/finance/TransferForm";
import type { Account } from "@/types/account";

type CreateTransferSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly accounts?: Account[];
  readonly isLoadingAccounts?: boolean;
  readonly isErrorAccounts?: boolean;
};

export default function CreateTransferSheet({
  open,
  onClose,
  accounts = [],
  isLoadingAccounts = false,
  isErrorAccounts = false,
}: CreateTransferSheetProps): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} title="Nueva transferencia">
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

      {!isLoadingAccounts && !isErrorAccounts && accounts.length < 2 && (
        <EmptyState
          title="No hay cuentas suficientes"
          description="Necesitás al menos dos cuentas activas para registrar una transferencia."
        />
      )}

      {!isLoadingAccounts && !isErrorAccounts && accounts.length >= 2 && (
        <TransferForm accounts={accounts} onSuccess={onClose} />
      )}
    </Modal>
  );
}