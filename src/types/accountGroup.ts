import { CURRENCIES } from "@/config/currencies";

// IDs de la tabla account_groups (DB): LIQUID / INVESTMENT / DEBT
export const ACCOUNT_GROUP_OPTIONS = [
  { id: 1, label: "Liquidez" },
  { id: 2, label: "Inversión" },
  { id: 3, label: "Deuda" },
];

export const ACCOUNT_TYPE_OPTIONS = [
  { value: "WALLET", label: "Wallet" },
  { value: "BANK", label: "Banco" },
  { value: "BROKER", label: "Broker" },
  { value: "CASH", label: "Efectivo" },
  { value: "CRYPTO", label: "Cripto" },
  { value: "CARD", label: "Tarjeta" },
  { value: "OTHER", label: "Otro" },
];

// Derivado del registro central: agregar una divisa allá la habilita acá
export const CURRENCY_OPTIONS = CURRENCIES.map((currency) => ({
  value: currency.code,
  label: currency.label,
}));