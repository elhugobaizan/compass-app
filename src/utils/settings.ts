import type { Setting } from "@/types/settings";
import { toNumber } from "./numbers";

const NET_WORTH_SETTING_KEYS = [
  "casa",
  "auto",
  "efectivo",
  "dolares"
];

export function getNetWorthExtrasFromSettings(
  settings: Setting[] = []
): number {
  return settings.reduce((sum, setting) => {
    if (NET_WORTH_SETTING_KEYS.includes(setting.key)) {
      return sum + toNumber(setting.value)
    }

    return sum;
  }, 0);
};