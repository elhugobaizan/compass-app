import { useMemo } from "react";
import { ChartItem, Movimiento, MovimientoBase, MovimientoMetricsResult } from "../types";
import { DateTime } from "luxon";
import { normalizarVencimiento } from "../../../utils";
import { iconoTipoGasto, TipoGasto } from "../../../types";

function getTotalHoy(gastos: MovimientoBase[]): number {
  if (!gastos?.length) return 0;
  const hoy = DateTime.now().startOf('day');
  return gastos.reduce((suma, gasto) => {
    const normalized = normalizarVencimiento(gasto.Fecha ?? '');
    if (!normalized) return suma;
    const dt = DateTime.fromFormat(normalized, 'yyyy-MM-dd').startOf('day');
    return dt.isValid && hoy.equals(dt) ? suma + gasto.Monto : suma;
  }, 0);
}

/** Filtra gastos que pertenecen al mes indicado (por defecto, mes actual). */
export function filterGastosDelMes<T extends MovimientoBase>(
  gastos: T[],
  refDate: DateTime = DateTime.now()
): T[] {
  const inicioMes = refDate.startOf('month');
  return gastos.filter((gasto) => {
    const normalized = normalizarVencimiento(gasto.Fecha ?? '');
    if (!normalized) return false;
    const dt = DateTime.fromFormat(normalized, 'yyyy-MM-dd').startOf('month');
    return dt.isValid && dt.equals(inicioMes);
  });
}

function getTotalGastosMes(gastos: MovimientoBase[]): number {
  return getTotalGastos(filterGastosDelMes(gastos));
};

function getTotalGastos(movimientos: MovimientoBase[]): number {
  return movimientos.reduce((suma, movimiento) => suma + movimiento.Monto, 0);
};

function buildChartItemsByCategoria(result: Movimiento[]): ChartItem[] {
  const totalGastos = result.reduce((acc, g) => acc + g.Monto, 0);
  const byTipo = result.reduce<Record<number, number>>((acc, g) => {
    const t = g.Tipo as TipoGasto;
    acc[t] = (acc[t] || 0) + g.Monto;
    return acc;
  }, {});
  const items: ChartItem[] = Object.entries(byTipo)
    .map(([key, value]) => {
      const tipo = iconoTipoGasto.find((i) => i.value === +key) ?? iconoTipoGasto[0];
      return {
        value,
        color: tipo.color,
        text: totalGastos > 0 ? `${((value * 100) / totalGastos).toFixed(0)}%` : "0%",
        label: tipo.label,
      };
    })
    .sort((a, b) => b.value - a.value);
  return items;
}

function getGastosFijosMes(gastos: MovimientoBase[]): number {
  const gastosFijos = filterGastosDelMes(gastos);
  return gastosFijos.reduce((suma, gasto) => {
    if (gasto.Tipo === TipoGasto.Impuestos) return suma + gasto.Monto;
    return suma;
  }, 0);
}

function getVariablesFijosMes(gastos: MovimientoBase[]): number {
  const variablesFijos = filterGastosDelMes(gastos);
  return variablesFijos.reduce((suma, gasto) => {
    if (gasto.Tipo !== TipoGasto.Impuestos) return suma + gasto.Monto;
    return suma;
  }, 0);
}

function getProyeccionMensual(gastos: MovimientoBase[]): number {
  // Si al dia de hoy he gastado X en el mes, la proyección mensual es X / dias transcurridos en el mes * dias del mes
  const diasTranscurridos = DateTime.now().day;
  const gastosFijosMes = getGastosFijosMes(gastos);
  const gastosVariablesMes = getVariablesFijosMes(gastos);

  if (diasTranscurridos < 5) return gastosFijosMes + gastosVariablesMes;

  const diasDelMes = DateTime.now().daysInMonth;
  const proyeccionMensual = gastosFijosMes + (gastosVariablesMes / diasTranscurridos) * diasDelMes;
  return proyeccionMensual;
}

function getRitmoDeGasto(gastos: MovimientoBase[]): number {
  const diasTranscurridos = DateTime.now().day;
  const diasDelMes = DateTime.now().daysInMonth;
  const totalGastosMes = getTotalGastosMes(gastos);
  const ritmoEsperado = (diasTranscurridos / diasDelMes) * 2900000;
  const ritmoActual = totalGastosMes;
  const ratio = ritmoActual / ritmoEsperado;
  return ratio;
}

function getDesvioProyectado(gastos: MovimientoBase[]): number {
  const cierreEstimado = getProyeccionMensual(gastos);
  return 2900000 - cierreEstimado;
}

export function useGastosMetrics<T extends MovimientoBase>(
  gastos: T[]
): MovimientoMetricsResult<T> {
  return useMemo(() => {
    const totalGastosHoy = getTotalHoy(gastos);
    const totalGastos = getTotalGastos(gastos);
    const totalGastosMes = getTotalGastosMes(gastos);
    const itemsByCategoria = buildChartItemsByCategoria(gastos as unknown as Movimiento[]);
    const proyeccionMensual = getProyeccionMensual(gastos);
    const ritmoMensual = getRitmoDeGasto(gastos);
    const gastosFijosMes = getGastosFijosMes(gastos);
    const gastosVariablesMes = getVariablesFijosMes(gastos);
    const desvioProyectado = getDesvioProyectado(gastos);
    return {
      totalGastosHoy,
      totalGastos,
      totalGastosMes,
      gastosFijosMes,
      gastosVariablesMes,
      itemsByCategoria,
      proyeccionMensual,
      ritmoMensual,
      desvioProyectado,
    };
  }, [gastos]);
}