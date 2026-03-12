// theme/financialColors.ts

import { colors } from './colors';

export enum FinancialAssetType {
  Liquidity = 'liquidity',
  FixedDeposit = 'fixedDeposit',
  Funds = 'funds',
  USD = 'usd',
  Crypto = 'crypto',
}

export function getFinancialColor(type: FinancialAssetType): string {

  switch (type) {

    // dinero disponible inmediato
    case FinancialAssetType.Liquidity:
      return colors.financial.liquid;

    // plazos fijos, CEDEARs, inversiones estables
    case FinancialAssetType.FixedDeposit:
      return colors.financial.stableStore;

    // fondos rescatables inmediatos
    case FinancialAssetType.Funds:
      return colors.financial.semiLiquid;

    // dólares como reserva de valor
    case FinancialAssetType.USD:
      return colors.financial.stableStore;

    // crypto
    case FinancialAssetType.Crypto:
      return colors.financial.volatile;

    default:
      return colors.text.muted;
  }
}

// theme/useFinancialColor.ts
export function useFinancialColor(type: FinancialAssetType): string {
  return getFinancialColor(type);
}