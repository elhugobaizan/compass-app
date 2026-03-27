import { JSX } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type ConfirmDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly loadingText?: string;
  readonly confirmVariant?: "primary" | "secondary" | "danger";
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
  loadingText = "Procesando...",
  confirmVariant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps): JSX.Element {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        {description && <p className="text-sm leading-6 text-gray-600">{description}</p>}

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingText : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}