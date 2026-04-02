import { JSX, useState } from "react";

import Button from "@/components/ui/Button";

import { useCreateBill } from "@/hooks/mutations/useCreateBill";
import { useUpdateBill } from "@/hooks/mutations/useUpdateBill";

import type { Account } from "@/types/account";
import type { Bill, BillInput } from "@/types/bill";
import { Category } from "@/types/category";

type BillFormValues = Omit<
  Bill,
  | "id"
  | "deleted_at"
  | "created_at"
  | "updated_at"
  | "account"
  | "category"
>;

type BillFormProps = {
  readonly accounts: Account[];
  readonly categories?: Category[];
  readonly mode?: "create" | "edit";
  readonly billId?: string;
  readonly initialValues?: BillFormValues;
  readonly onSuccess?: () => void;
};

export default function BillForm({
  accounts,
  categories = [],
  mode = "create",
  billId,
  initialValues,
  onSuccess,
}: BillFormProps): JSX.Element {
  const { mutateAsync: createMutate, isPending: isCreating } = useCreateBill();
  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdateBill();

  const isPending = isCreating || isUpdating;

  const [accountId, setAccountId] = useState(initialValues?.account_id || "");
  const [name, setName] = useState(initialValues?.name || "");
  const [dueDay, setDueDay] = useState(
    initialValues?.due_day?.toString() || "",
  );
  const [defaultAmount, setDefaultAmount] = useState(
    initialValues?.default_amount?.toString() || 0,
  );
  const [customerNumber, setCustomerNumber] = useState(
    initialValues?.customer_number || "",
  );
  const [notes, setNotes] = useState(initialValues?.notes || "");
  const [logo, setLogo] = useState(initialValues?.logo || "");
  const [url, setUrl] = useState(initialValues?.url || "");
  const [categoryId, setCategoryId] = useState(initialValues?.category_id || "");
  const [isActive, setIsActive] = useState(initialValues?.is_active ?? true);
  const [provider, setProvider] = useState(initialValues?.provider || "");
  const [referenceNumber, setReferenceNumber] = useState(initialValues?.reference_number || "");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isValid = name.trim().length > 0 && accountId.trim().length > 0;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!isValid) return;

    const parsedDueDay = dueDay ? Number(dueDay) : null;
    const parsedDefaultAmount = defaultAmount
      ? Number(defaultAmount)
      : 0;

    const payload: BillInput = {
      name: name.trim(),
      due_day: parsedDueDay,
      account_id: accountId,
      notes: notes.trim() || null,
      logo: logo.trim() || null,
      url: url.trim() || null,
      category_id: categoryId || null,
      customer_number: customerNumber.trim() || null,
      default_amount: parsedDefaultAmount,
      is_active: isActive,
      provider: provider.trim() || null,
      reference_number: referenceNumber.trim() || null

    };

    try {
      setSubmitError(null);

      if (mode === "edit") {
        if (!billId) {
          setSubmitError("El billId es requerido en modo edición.");
          return;
        }

        await updateMutate({ id: billId, data: payload });
      } else {
        await createMutate(payload);

        setAccountId("");
        setName("");
        setDueDay("");
        setDefaultAmount(0);
        setCustomerNumber("");
        setNotes("");
        setLogo("");
        setUrl("");
        setCategoryId("");
        setProvider("");
        setReferenceNumber("");
        setIsActive(true);
      }

      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : mode === "edit"
            ? "No pudimos actualizar el impuesto."
            : "No pudimos guardar el impuesto.";

      setSubmitError(message);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div>
        <label
          htmlFor="account"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Cuenta
        </label>
        <select
          id="account"
          name="account"
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        >
          <option value="">Seleccionar cuenta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: Luz, Gas, Internet"
        />
      </div>

      <div>
        <label
          htmlFor="dueDay"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Día de vencimiento
        </label>
        <input
          id="dueDay"
          name="dueDay"
          type="number"
          inputMode="numeric"
          min="1"
          max="31"
          value={dueDay}
          onChange={(event) => setDueDay(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: 10"
        />
      </div>

      <div>
        <label
          htmlFor="defaultAmount"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Monto estimado
        </label>
        <input
          id="defaultAmount"
          name="defaultAmount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={defaultAmount}
          onChange={(event) => setDefaultAmount(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: 25000"
        />
      </div>

      <div>
        <label
          htmlFor="customerNumber"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Número de cliente
        </label>
        <input
          id="customerNumber"
          name="customerNumber"
          type="text"
          value={customerNumber}
          onChange={(event) => setCustomerNumber(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: 12345678"
        />
      </div>

      <div>
        <label
          htmlFor="url"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: https://..."
        />
      </div>

      <div>
        <label
          htmlFor="logo"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Logo
        </label>
        <input
          id="logo"
          name="logo"
          type="text"
          value={logo}
          onChange={(event) => setLogo(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="URL o identificador del logo"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="min-h-24 w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Información extra, referencia, observaciones..."
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="category"
          name="category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        >
          <option value="">Sin categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="provider"
          className="mb-1 block text-sm font-medium text-gray-700">
          Proveedor
        </label>
        <input
          id="provider"
          name="provider"
          type="text"
          value={provider}
          onChange={(event) => setProvider(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="referenceNumber"
          className="mb-1 block text-sm font-medium text-gray-700">
          Número de referencia
        </label>
        <input
          id="referenceNumber"
          name="referenceNumber"
          type="text"
          value={referenceNumber}
          onChange={(event) => setReferenceNumber(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Impuesto activo
      </label>

      <Button type="submit" fullWidth disabled={!isValid || isPending}>
        {isPending
          ? "Guardando..."
          : mode === "edit"
            ? "Guardar cambios"
            : "Guardar impuesto"}
      </Button>
    </form>
  );
}