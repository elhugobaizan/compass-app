import { JSX } from "react";

import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import BillForm from "@/components/finance/bills/BillForm";

import type { Account } from "@/types/account";
import { Category } from "@/types/category";

type CreateBillSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly accounts?: Account[];
  readonly isLoadingAccounts?: boolean;
  readonly isErrorAccounts?: boolean;
  readonly categories?: Category[];
};

export default function CreateBillSheet({
  open,
  onClose,
  accounts = [],
  isLoadingAccounts = false,
  isErrorAccounts = false,
  categories = [],
}: CreateBillSheetProps): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} title="Nuevo impuesto">
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
          description="Necesitás al menos una cuenta para registrar un impuesto."
        />
      )}

      {!isLoadingAccounts && !isErrorAccounts && accounts.length > 0 && (
        <BillForm accounts={accounts} categories={categories} onSuccess={onClose} />
      )}
    </Modal>
  );
}