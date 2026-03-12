import { useMemo } from 'react'
/* import { TipoGasto } from '../types'
import { Movimiento } from '../pages/Movimientos/types'
 */
export interface CoverageMetrics {
  coverageMonths: number
  coverageDays: number
  avgMonthlyExpenses: number
  monthlyBaseline: number
}

interface UseCoverageMetricsParams {
  movimientos: any[]
  currentBalanceARS: number
}

function isRealExpense(tipo: any): boolean {
  switch (tipo) {
    case "TipoGasto.Comida":
    case "TipoGasto.Bebida":
    case "TipoGasto.Servicios":
    case "TipoGasto.Impuestos":
      return true

    default:
      return false
  }
}

export function useCoverageMetrics({
  movimientos,
  currentBalanceARS,
}: UseCoverageMetricsParams): CoverageMetrics {

  return useMemo(() => {

    const monthlyTotals = new Map<string, number>()

    for (const movimiento of movimientos) {

      if (!movimiento.Fecha) continue

      if (!isRealExpense(movimiento.Tipo)) continue

      if (movimiento.Monto <= 0) continue

      const date = new Date(movimiento.Fecha)

      const key = `${date.getFullYear()}-${date.getMonth()}`

      const current = monthlyTotals.get(key) ?? 0

      monthlyTotals.set(key, current + movimiento.Monto)
    }

    if (monthlyTotals.size === 0) {
      return {
        coverageMonths: 0,
        coverageDays: 0,
        avgMonthlyExpenses: 0,
        monthlyBaseline: 0,
      }
    }

    const sortedMonths = Array.from(monthlyTotals.entries())
      .sort(([a], [b]) => a.localeCompare(b))

    const now = new Date()
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`

    const completeMonths = sortedMonths.filter(
      ([monthKey]) => monthKey !== currentMonthKey
    )

    if (completeMonths.length === 0) {
      return {
        coverageMonths: 0,
        coverageDays: 0,
        avgMonthlyExpenses: 0,
        monthlyBaseline: 0,
      }
    }

    const totalExpenses = completeMonths.reduce(
      (sum, [, value]) => sum + value,
      0
    )

    const avgMonthlyExpenses = totalExpenses / completeMonths.length

    const coverageMonths =
      avgMonthlyExpenses > 0
        ? currentBalanceARS / avgMonthlyExpenses
        : 0

    const coverageDays = coverageMonths * 30.4375

    return {
      coverageMonths,
      coverageDays,
      avgMonthlyExpenses,
      monthlyBaseline: avgMonthlyExpenses,
    }

  }, [movimientos, currentBalanceARS])
}
