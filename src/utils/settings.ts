import type { Setting } from "@/types/settings";
import { toNumber } from "./numbers";

const NET_WORTH_SETTING_KEYS = new Set([
  "casa",
  "auto",
  "efectivo",
  "dolares"
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