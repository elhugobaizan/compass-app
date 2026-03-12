export type GoalCardProps = {
  readonly title: string
  readonly type: 'travel' | 'goal'
  readonly totalBudget: number
  readonly spent: number
  readonly startDate: Date
  readonly endDate: Date
  readonly onPress?: () => void
};

/** Tipo seleccionable en el formulario Add Objetivo. */
export type ObjetivoTipo = "travel" | "goal";

/** Datos del plan de un objetivo/viaje (formulario Add Objetivo). */
export type ObjetivoPlan = {
  title: string
  description: string
  startDate: string
  endDate: string
  budget: number
}