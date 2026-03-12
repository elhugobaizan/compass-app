import { useMemo } from 'react';
import type { Wallet } from '@/types/wallets';

export type WalletBase = Pick<Wallet, 'id' | 'Efectivo' | 'Interes'>

export type WalletWithMetrics<T extends WalletBase> = T & {
  monthlyInterest: number
  sharePercent: number
}

export type WalletMetricsResult<T extends WalletBase> = {
  wallets: WalletWithMetrics<T>[]
  totalBalance: number
  totalMonthlyInterest: number
  weightedRate: number
}

export type WalletEfficiencyResult = {
  efficiency: number
  maxTNA: number
  opportunityGap: number
  potentialGain: number
  suggestedTransfer: number
}

export function useWalletMetrics<T extends WalletBase>(
  wallets: T[]
): WalletMetricsResult<T> {

  return useMemo(() => {

    const totalBalance =
      wallets.reduce((sum, w) => sum + w.Efectivo, 0)

    if (totalBalance === 0) {
      return {
        wallets: wallets.map(w => ({
          ...w,
          monthlyInterest: 0,
          sharePercent: 0,
        })),
        totalBalance: 0,
        totalMonthlyInterest: 0,
        weightedRate: 0,
        maxTNA: 0,
        minTNA: 0,
        avgTNA: 0,
        efficiency: 0,
      }
    }

    const walletsWithMetrics =
      wallets.map(wallet => {

        const monthlyInterest =
          wallet.Efectivo * wallet.Interes / 100 / 12

        const sharePercent =
          wallet.Efectivo / totalBalance * 100

        return {
          ...wallet,
          monthlyInterest,
          sharePercent,
        }
      })

    const totalMonthlyInterest =
      walletsWithMetrics.reduce(
        (sum, w) => sum + w.monthlyInterest,
        0
      )

    const weightedRate =
      totalMonthlyInterest / totalBalance * 12 * 100;

    return {
      wallets: walletsWithMetrics,
      totalBalance,
      totalMonthlyInterest,
      weightedRate,
    }

  }, [wallets])
}

export function useWalletEfficiency(wallets: WalletBase[]): WalletEfficiencyResult {
  return useMemo(() => {
    const totalCapital = wallets.reduce((acc, w) => acc + w.Efectivo, 0)
    const weightedAverage =
      wallets.reduce((acc, w) => acc + w.Efectivo * w.Interes, 0) /
      totalCapital


    const maxTNA = Math.max(...wallets.map(w => w.Interes));
    const efficiency = weightedAverage / maxTNA;
    const opportunityGap = maxTNA - weightedAverage;
    const potentialGain = 0;
    const suggestedTransfer = totalCapital * opportunityGap / 100 / 12;

    return {
      efficiency,
      maxTNA,
      opportunityGap,
      potentialGain,
      suggestedTransfer,
    }
  }, [wallets])
}