import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import type { Account } from "@/types/account";
import type { Bill } from "@/types/bill";
import { Category } from "@/types/category";
import BillForm from "./bills/BillForm";

type EditBillSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly bill?: Bill | null;
  readonly accounts?: Account[];
  readonly categories?: Category[];
  readonly isLoadingAccounts?: boolean;
  readonly isErrorAccounts?: boolean;
};

export default function EditBillSheet({
  open,
  onClose,
  bill,
  accounts = [],
  categories = [],
  isLoadingAccounts = false,
  isErrorAccounts = false,
}: EditBillSheetProps): JSX.Element {

  return (
    <Modal open={open} onClose={onClose} title="Editar impuesto">
      {isLoadingAccounts && (
        <p className="text-sm text-gray-500">Cargando datos del formulario...</p>
      )}

      {isErrorAccounts && (
        <EmptyState
          title="No pudimos cargar el formulario"
          description="Revisá la conexión o el backend e intentá de nuevo."
          variant="error"
        />
      )}

      {!isLoadingAccounts && !isErrorAccounts && !bill && (
        <EmptyState
          title="No encontramos la factura"
          description="Probá cerrando e intentando de nuevo."
          variant="error"
        />
      )}

      {!isLoadingAccounts && !isErrorAccounts && bill && accounts.length > 0 && (
        <BillForm
          mode="edit"
          billId={bill.id}
          accounts={accounts}
          categories={categories}
          onSuccess={onClose}
          initialValues={{
            name: bill.name,
            due_day: bill.due_day,
            account_id: bill.account_id,
            notes: bill.notes,
            logo: bill.logo,
            url: bill.url,
            category_id: bill.category_id,
            customer_number: bill.customer_number,
            default_amount: bill.default_amount,
            is_active: bill.is_active,
            provider: bill.provider,
            reference_number: bill.reference_number,
          }}
        />
      )}
    </Modal>
  );
}