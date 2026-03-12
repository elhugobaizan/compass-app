import { useMemo } from 'react';
import { calculateMensual } from '../../../utils';
import type { BancoBase, BancoMetricsResult, PlazosFijo } from '../types';

export function useBancosMetrics<T extends BancoBase>(
  bancos: T[]
): BancoMetricsResult<T> {
  return useMemo(() => {
    const totalLiquidez = bancos.reduce((acc, banco) => acc + banco.Efectivo, 0);
    const totalPlazosFijos = bancos.reduce((acc, banco) => acc + (banco.PlazosFijos ?? []).reduce((innerAcc: number, plazo: PlazosFijo) => innerAcc + plazo.Capital, 0), 0);
    const totalBancos = totalLiquidez + totalPlazosFijos;
    const totalInteresMensual = bancos.reduce((acc, banco) => acc + (banco.PlazosFijos ?? []).reduce((innerAcc: number, plazo: PlazosFijo) => innerAcc + calculateMensual(plazo), 0), 0);
    const cantidadPlazosFijos = bancos.reduce((acc, banco) => acc + (banco.PlazosFijos ?? []).length, 0);
    const tnaPromedio = bancos.reduce((acc, banco) => acc + (banco.PlazosFijos ?? []).reduce((innerAcc: number, plazo: PlazosFijo) => innerAcc + plazo.TNA, 0), 0) / cantidadPlazosFijos;
    const maxTNA = Math.max(...bancos.flatMap(banco => banco.PlazosFijos?.map(plazo => plazo.TNA) ?? []));
    return {
      totalLiquidez,
      totalPlazosFijos,
      totalInteresMensual,
      totalBancos,
      tnaPromedio,
      maxTNA
    };
  }, [bancos]);
};