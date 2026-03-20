import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import type { Account } from "@/types/account";
import AccountForm from "./AccountForm";

type EditAccountSheetProps = {
  open: boolean;
  onClose: () => void;
  account?: Account | null;
};

export default function EditAccountSheet({
  open,
  onClose,
  account,
}: EditAccountSheetProps): JSX.Element {
  const isLoading = false;
  const isError = false;

  return (
    <Modal open={open} onClose={onClose} title="Editar cuenta">
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

      {!isLoading && !isError && !account && (
        <EmptyState
          title="No encontramos la cuenta"
          description="Probá cerrando e intentando de nuevo."
          variant="error"
        />
      )}

      {!isLoading && !isError && account && (
        <AccountForm
          mode="edit"
          accountId={account.id}
          initialValues={{
            name: account.name,
            account_type: account.account_type,
            account_group_id: account.account_group_id,
            currency: account.currency,
            institution: account.institution,
            opening_balance: account.opening_balance,
            opening_date: account.opening_date?.slice(0, 10),
            is_payment_method: account.is_payment_method ?? false,
          }}
          onSuccess={onClose}
        />
      )}
    </Modal>
  );
}