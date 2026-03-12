import { useMemo } from "react";
import { ImpuestoBase, ImpuestoMetricsResult } from "../types";

export function useImpuestosMetrics<T extends ImpuestoBase>(
  impuestos: T[]
): ImpuestoMetricsResult<T> {
  return useMemo(() => {
    const totalImpuestos = impuestos.reduce((acc, impuesto) => acc + impuesto.Deuda, 0);
    return {
      totalImpuestos,
    };
  }, [impuestos]);
};