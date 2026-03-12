import { DateTime } from "luxon";
import { useMemo } from "react";
import { TravelDetails, TravelExpense, TravelMetricsResult } from "../types";

function getTotalDays(startDate: string, endDate: string): number {
  const start = DateTime.fromFormat(startDate, 'yyyy-MM-dd');
  const end = DateTime.fromFormat(endDate, 'yyyy-MM-dd');
  return end.diff(start, 'days').days;
}

function getRemainingDays(startDate: string, endDate: string): number {
  const start = DateTime.fromFormat(startDate, 'yyyy-MM-dd');
  const end = DateTime.fromFormat(endDate, 'yyyy-MM-dd');
  const today = DateTime.now();
  // Si ya paso, quedan 0 dias
  if (today.diff(end, 'days').days > 0) {
    return 0;
  }
  // Si todavia no comienza, quedan los dias totales
  if (today.diff(start, 'days').days < 0) {
    return end.diff(start, 'days').days;
  }

  // Si ya comenzó, quedan los dias restantes hasta el final
  return end.diff(today, 'days').days;
}

function getTotalTravelExpenses(expenses: TravelExpense[]): number {
  return expenses.reduce((acc, expense) => acc + expense.amount, 0);
}

function getRemainingBudget(budget: number, expenses: TravelExpense[]): number {
  return budget - getTotalTravelExpenses(expenses);
}

function getTodayExpenses(expenses: TravelExpense[]): number {
  const today = DateTime.now().toFormat('yyyy-MM-dd');
  return expenses.filter(expense => expense.date === today).reduce((acc, expense) => acc + expense.amount, 0);
}

function getDailyAllowedBudget(travelDetails: TravelDetails): number {
  const remainingBudget = getRemainingBudget(travelDetails.plan.budget, travelDetails.expenses);
  const remainingDays = getRemainingDays(travelDetails.plan.startDate, travelDetails.plan.endDate);
  return remainingBudget / Math.max(remainingDays, 1);
}

function getInitialDailyAllowedBudget(travelDetails: TravelDetails): number {
  const totalDays = getTotalDays(travelDetails.plan.startDate, travelDetails.plan.endDate);
  const totalExpenses = getTotalTravelExpenses(travelDetails.expenses);
  return totalExpenses / totalDays;
}

const EMPTY_METRICS: TravelMetricsResult<TravelDetails> = {
  totalDays: 0,
  remainingDays: 0,
  totalExpenses: 0,
  remainingBudget: 0,
  dailyAllowedBudget: 0,
  initialDailyAllowedBudget: 0,
  todayExpenses: 0,
};

export function useTravelMetrics<T extends TravelDetails>(
  travelDetails: T | undefined
): TravelMetricsResult<T> {
  return useMemo(() => {
    if (travelDetails?.plan == null) {
      return EMPTY_METRICS as TravelMetricsResult<T>;
    }
    const totalDays = getTotalDays(travelDetails.plan.startDate, travelDetails.plan.endDate);
    const totalExpenses = getTotalTravelExpenses(travelDetails.expenses ?? []);
    const remainingDays = getRemainingDays(travelDetails.plan.startDate, travelDetails.plan.endDate);
    const remainingBudget = getRemainingBudget(travelDetails.plan.budget, travelDetails.expenses ?? []);
    const dailyAllowedBudget = getDailyAllowedBudget(travelDetails);
    const initialDailyAllowedBudget = getInitialDailyAllowedBudget(travelDetails);
    const todayExpenses = getTodayExpenses(travelDetails.expenses ?? []);
    return {
      totalDays,
      remainingDays,
      totalExpenses,
      remainingBudget,
      dailyAllowedBudget,
      initialDailyAllowedBudget,
      todayExpenses,
    };
  }, [travelDetails]);
}