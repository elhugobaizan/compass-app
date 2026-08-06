import type { Setting } from "@/types/settings";
import { toNumber } from "./numbers";

const NET_WORTH_SETTING_KEYS = new Set([
  "casa",
  "auto",
  "dolares",
  "deuda", // en este modelo, "deuda" = dinero que te deben (suma al patrimonio, no a la liquidez)
  // "efectivo" ya no va acá: el efectivo se maneja como cuentas (Efectivo ARS/USD/EUR)
]);

export function getNetWorthExtrasFromSettings(
  settings: Setting[] = []
): number {
  return settings.reduce((sum, setting) => {
    if (NET_WORTH_SETTING_KEYS.has(setting.key)) {
      return sum + toNumber(setting.value)
    }

    return sum;
  }, 0);
};

/** Total que te deben (registrado en el setting "deuda"). Suma al patrimonio, no a la liquidez. */
export function getReceivablesFromSettings(settings: Setting[] = []): number {
  const setting = settings.find((s) => s.key === "deuda");
  return toNumber(setting?.value);
}