import { useMemo, useState, JSX } from "react";
import Button from "@/components/ui/Button";
import type { Account } from "@/types/account";
import { useCreateAsset } from "@/hooks/mutations/useCreateAsset";

type AssetFormProps = {
  readonly accounts: Account[];
  readonly onSuccess?: () => void;
};

const ASSET_TYPES = [
  { value: "CRYPTO", label: "Cripto" },
  { value: "STOCK", label: "Acción / ETF" },
  { value: "FIXED_DEPOSIT", label: "Plazo fijo" },
  { value: "OTHER", label: "Otro" },
];

export default function AssetForm({
  accounts,
  onSuccess,
}: AssetFormProps): JSX.Element {
  const { mutateAsync, isPending } = useCreateAsset();

  const [accountId, setAccountId] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [assetType, setAssetType] = useState("CRYPTO");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [capital, setCapital] = useState("");
  const [interest, setInterest] = useState("");
  const [startDate, setStartDate] = useState("");
  const [maturity, setMaturity] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isMarketAsset = useMemo(
    () => assetType === "CRYPTO" || assetType === "STOCK",
    [assetType]
  );

  const isFixedDeposit = assetType === "FIXED_DEPOSIT";

  const isValid = accountId.trim().length > 0 && name.trim().length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    try {
      setSubmitError(null);

      await mutateAsync({
        account_id: accountId,
        name: name.trim(),
        symbol: symbol.trim() || undefined,
        asset_type: assetType,
        quantity: quantity ? Number(quantity) : undefined,
        price: price ? Number(price) : undefined,
        capital: capital ? Number(capital) : undefined,
        interest: interest ? Number(interest) : undefined,
        start_date: startDate || undefined,
        maturity: maturity || undefined,
      });

      setAccountId("");
      setName("");
      setSymbol("");
      setAssetType("CRYPTO");
      setQuantity("");
      setPrice("");
      setCapital("");
      setInterest("");
      setStartDate("");
      setMaturity("");

      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No pudimos guardar el asset.";

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
        <label htmlFor="account" className="mb-1 block text-sm font-medium text-gray-700">
          Cuenta
        </label>
        <select
          name="account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
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
        <label htmlFor="asset" className="mb-1 block text-sm font-medium text-gray-700">
          Tipo de asset
        </label>
        <select
          name="asset"
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        >
          {ASSET_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: Bitcoin, SPY, Plazo fijo Galicia"
        />
      </div>

      <div>
        <label htmlFor="symbol" className="mb-1 block text-sm font-medium text-gray-700">
          Símbolo
        </label>
        <input
          name="symbol"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          placeholder="Ej: BTC, SPY"
        />
      </div>

      {isMarketAsset && (
        <>
          <div>
            <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <input
              name="quantity"
              type="number"
              inputMode="decimal"
              step="0.00000001"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              name="price"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>
        </>
      )}

      {isFixedDeposit && (
        <>
          <div>
            <label htmlFor="capital" className="mb-1 block text-sm font-medium text-gray-700">
              Capital
            </label>
            <input
              name="capital"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="interest" className="mb-1 block text-sm font-medium text-gray-700">
              Interés / TNA
            </label>
            <input
              name="interest"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700">
              Fecha de inicio
            </label>
            <input
              name="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="maturity" className="mb-1 block text-sm font-medium text-gray-700">
              Vencimiento
            </label>
            <input
              name="maturity"
              type="date"
              value={maturity}
              onChange={(e) => setMaturity(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>
        </>
      )}

      <Button type="submit" fullWidth disabled={!isValid || isPending}>
        {isPending ? "Guardando..." : "Guardar asset"}
      </Button>
    </form>
  );
}