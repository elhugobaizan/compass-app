import { Bitcoin, Landmark, TrendingUp, Wallet, type LucideIcon } from "lucide-react";

export type AssetType = "CRYPTO" | "STOCK" | "FIXED_DEPOSIT" | "OTHER";

type AssetTypeConfig = {
  readonly label: string;
  readonly Icon: LucideIcon;
  readonly containerClassName: string;
  readonly iconClassName: string;
  readonly showsQuantityPrice: boolean;
  readonly showsCapitalInterest: boolean;
  readonly showsSymbol: boolean;
};

export const ASSET_TYPE_CONFIG: Record<AssetType, AssetTypeConfig> = {
  CRYPTO: {
    label: "Cripto",
    Icon: Bitcoin,
    containerClassName: "bg-amber-50 border border-amber-100",
    iconClassName: "text-amber-600",
    showsQuantityPrice: true,
    showsCapitalInterest: false,
    showsSymbol: true,
  },
  STOCK: {
    label: "Acción / ETF",
    Icon: TrendingUp,
    containerClassName: "bg-violet-50 border border-violet-100",
    iconClassName: "text-violet-700",
    showsQuantityPrice: true,
    showsCapitalInterest: false,
    showsSymbol: true,
  },
  FIXED_DEPOSIT: {
    label: "Plazo fijo",
    Icon: Landmark,
    containerClassName: "bg-sky-50 border border-sky-100",
    iconClassName: "text-sky-700",
    showsQuantityPrice: false,
    showsCapitalInterest: true,
    showsSymbol: false,
  },
  OTHER: {
    label: "Otro",
    Icon: Wallet,
    containerClassName: "bg-gray-50 border border-gray-100",
    iconClassName: "text-gray-600",
    showsQuantityPrice: false,
    showsCapitalInterest: false,
    showsSymbol: false,
  },
};

export const ASSET_TYPES = (Object.keys(ASSET_TYPE_CONFIG) as AssetType[]).map(
  (value) => ({ value, label: ASSET_TYPE_CONFIG[value].label })
);

export function getAssetTypeConfig(assetType: string): AssetTypeConfig {
  return ASSET_TYPE_CONFIG[assetType as AssetType] ?? ASSET_TYPE_CONFIG.OTHER;
}
