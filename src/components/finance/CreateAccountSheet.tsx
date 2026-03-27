import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import AccountForm from "@/components/finance/accounts/AccountForm";

type CreateAccountSheetProps = {
  readonly open: boolean;
  readonly onClose: () => void;
};

export default function CreateAccountSheet({
  open,
  onClose,
}: CreateAccountSheetProps): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} title="Nueva cuenta">
      <AccountForm onSuccess={onClose} />
    </Modal>
  );
}