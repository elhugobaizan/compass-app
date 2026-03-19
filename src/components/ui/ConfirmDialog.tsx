import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type ConfirmDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly isLoading?: boolean;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>

          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Eliminando..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}