import { useMemo } from "react"
/* import { PercentBar } from "../../../components/PercentBar" */
import { colors } from "../../theme/colors"
import { NumberToMoney } from "../../utils/utils"
import { theme } from "../../theme"
/* import { useTravelMetrics } from "../../Objetivos/Viajes/hooks/useViajesMetrics"
import { TravelDetails } from "../../Objetivos/Viajes/types"
 */

type GoalCardProps = {
  readonly variant: 'compact' | 'full' | 'list'
  readonly travelDetail: any | undefined
  readonly onPress?: () => void
}

export const GoalCard = (props: GoalCardProps) => {
  const { travelDetail, onPress } = props
  //const { remainingDays, totalDays, dailyAllowedBudget, todayExpenses } = useTravelMetrics(travelDetail);
  const remainingDays = 0;
  const totalDays = 0;
  const dailyAllowedBudget = 0;
  const todayExpenses = 0;
  const remaining = useMemo(() => {
    if (travelDetail?.plan == null) return 0;
    return travelDetail.plan.budget - travelDetail.expenses.reduce((acc: any, expense: any) => acc + expense.amount, 0);
  }, [travelDetail?.plan?.budget, travelDetail?.expenses]);
  const remainingPercentage = useMemo(() => {
    if (travelDetail?.plan == null) return 0;
    return travelDetail.expenses.reduce((acc: any, expense: any) => acc + expense.amount, 0) / travelDetail.plan.budget * 100;
  }, [travelDetail?.expenses, travelDetail?.plan?.budget]);
  const isCompleted = useMemo(() => remainingDays === 0, [remainingDays]);

  if (travelDetail?.plan == null) return null;



  if (props.variant === 'compact') {
    return (
      <div onClick={onPress}>
        <div style={{ marginTop: 12 }}>  {/* card.container */}
          <div>  {/* card.header */}
            <div ><img src={'plane'} color={colors.goals.primary} /></div>
            <span>{travelDetail.plan.title}</span>  {/* card.title */}
          </div>

          <span>  {/* card.label */}
            {remainingPercentage.toFixed(2)}% usado
          </span>
          <span>  {/* card.label */}
            {totalDays} días
          </span>
        </div>
      </div>
    );
  }
  if (props.variant === 'full') {
    return (
      <div onClick={onPress}>
        <div style={{ marginTop: 12 }}>
          <div>
            <div ><img src={'plane'} color={colors.goals.primary} /></div>
            <span>{travelDetail.plan.title}</span>
          </div>

          <span>
            ${remaining.toLocaleString()}
          </span>

          <span style={{ marginTop: 8 }}>
            {NumberToMoney(dailyAllowedBudget)} por día
          </span>

          {/*           <PercentBar items={[
            { label: 'Gastado', value: todayExpenses, color: colors.goals.accent },
            { label: 'Reservado', value: travelDetail.plan.budget - todayExpenses, color: colors.progress.background },
          ]} /> */}

          <div>  {/* card.footer */}
            <span>
              {remainingDays} días restantes
            </span>

            <span>
              {travelDetail.plan.startDate} → {travelDetail.plan.endDate}
            </span>
          </div>
        </div>
      </div>
    );
  }
  if (props.variant === 'list') {
    return (
      <div onClick={onPress} style={{ width: '100%' }}>
        <div>
          <div>
            <span style={{ fontSize: theme.typography.size.md }}>{travelDetail.plan.title}</span>
          </div>
          <span style={{ color: isCompleted ? colors.text.muted : colors.goals.primary }}>
            {isCompleted ? 'Viaje completado' : `${remainingDays.toFixed(0)} días restantes`}
          </span>
        </div>
      </div>
    );
  }
}