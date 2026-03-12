export type TravelDetails = {
  readonly plan: TravelPlan
  readonly expenses: TravelExpense[]
  /** Tipo de objetivo; por defecto 'travel' si no se especifica. */
  readonly tipo?: "travel" | "goal"
};

export type TravelPlanProps = {
  readonly plan: TravelPlan
};

export type TravelExpenseListProps = {
  readonly expenses: TravelExpense[]
};

export type TravelPlan = {
  title: string
  description: string
  startDate: string
  endDate: string
  budget: number
};

export type TravelExpense = {
  date: string
  amount: number
  category: string
  description: string
};

export type TravelMetricsResult<T extends TravelDetails> = {
  totalDays: number;
  remainingDays: number;
  totalExpenses: number;
  remainingBudget: number;
  dailyAllowedBudget: number;
  initialDailyAllowedBudget: number;
  todayExpenses: number;
};