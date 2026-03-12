import { useCallback, useMemo } from "react";
import HomeCard from "./HomeCard";
// import { PercentBar } from "../../../components/PercentBar";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { NumberToMoney } from "../../utils/utils";
import { useNavigation } from "react-router-dom";

export interface HoyCardData {
  readonly totalGastosHoy: number;
  readonly gastoMaxDiario: number;
  readonly interesesDelDia: number;
  readonly gastosPromedioMensual: number;
}

type HoyCardProps = {
  readonly data: HoyCardData;
  readonly platform?: "web" | "mobile";
};

type ProjectionStatus = "within" | "warning" | "danger";

function getProgressColor(ratio: number): string {
  if (ratio < 50) return colors.financial.income;
  if (ratio < 80) return colors.status.warning;
  return colors.financial.expense;
}

function getProjectionStatus(projectionRatio: number): ProjectionStatus {
  if (projectionRatio <= 1) return "within";
  if (projectionRatio <= 1.15) return "warning";
  return "danger";
}

const PROJECTION_LABELS: Record<ProjectionStatus, string> = {
  within: "Dentro del límite",
  warning: "Levemente por encima",
  danger: "Excederás el límite",
};

function getProjectionColor(status: ProjectionStatus): string {
  if (status === "within") return colors.status.positive;
  if (status === "warning") return colors.status.warning;
  return colors.status.negative;
}

export function HoyCard({ data, platform = "web" }: HoyCardProps) {
  const navigation = useNavigation();

  const ratio = useMemo(
    () => (data.gastoMaxDiario > 0 ? (data.totalGastosHoy * 100) / data.gastoMaxDiario : 0),
    [data.totalGastosHoy, data.gastoMaxDiario]
  );

  const progressColor = useMemo(() => getProgressColor(ratio), [ratio]);

  const proyeccion = useMemo(() => 0, []);//proyeccionDiaria(data.totalGastosHoy), [data.totalGastosHoy]);

  const projectionRatio = useMemo(
    () => (data.gastoMaxDiario > 0 ? proyeccion / data.gastoMaxDiario : 0),
    [proyeccion, data.gastoMaxDiario]
  );

  const projectionStatus = useMemo(() => getProjectionStatus(projectionRatio), [projectionRatio]);

  const projectionText = useMemo(() => PROJECTION_LABELS[projectionStatus], [projectionStatus]);

  const projectionTextColor = useMemo(() => getProjectionColor(projectionStatus), [projectionStatus]);

  const percentBarItems = useMemo(
    () => [
      { value: data.totalGastosHoy, color: progressColor, label: "Gastado hoy" },
      { value: proyeccion, color: `${progressColor}40`, label: "Proyección" },
      { value: data.gastoMaxDiario - data.totalGastosHoy, color: colors.text.muted, label: "Podés gastar hoy" },
    ],
    [data.totalGastosHoy, data.gastoMaxDiario, progressColor, proyeccion]
  );

  const handleNewExpense = useCallback(() => {
    console.log("Navigating to AddMovimiento");
  }, [navigation]);

  return (
    <HomeCard
      platform={platform}
      variant="default"
      fixed
      style={{ marginTop: 12 }}
      title={<span style={{ fontSize: 13, fontWeight: "600", color: colors.text.secondary, letterSpacing: 0.5 }}>HOY</span>}
      actions={
        <button
          style={{ marginLeft: 50, paddingLeft: 0, color: colors.primary.main, fontSize: 12, fontWeight: "500" }}
          onClick={handleNewExpense}
        >
          Nuevo movimiento
        </button>
      }
      value={
        <div style={{ paddingTop: 8 }}>
          <div style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ flexDirection: "column" }}>
                <span>Disponible hoy</span> {/*Card label*/}
                <span>  {/* style={card.value} */}
                  {NumberToMoney(data.gastoMaxDiario - data.totalGastosHoy)}
                </span>
              </div>
            </div>
          </div>
          <div style={{ justifyContent: "space-between" }}>
            <div style={{ marginBottom: 16, flexDirection: "row", display: "flex", alignItems: "flex-end", flexWrap: "wrap" }}>
              {/*               <PercentBar
                style={{ marginTop: 16, marginBottom: 0 }}
                size={200}
                height={12}
                items={percentBarItems}
              /> */}
              <span style={{ fontSize: typography.size.sm, color: colors.text.secondary, marginLeft: 16 }}>
                {ratio.toFixed(2)}% del límite diario
              </span>
            </div>
          </div>
          <div style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ flexDirection: "row" }}>
                <span style={{ fontSize: typography.size.sm, color: colors.text.secondary }}>Gastaste hoy</span>
                <span style={{ fontSize: typography.size.sm, color: colors.text.primary, marginLeft: 4 }}>
                  {NumberToMoney(data.totalGastosHoy)}
                </span>
              </div>
              <div style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: colors.text.secondary }}>Al ritmo actual</span>
                <div style={{ flexDirection: "row", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: colors.text.secondary, marginLeft: 4 }}>
                    {NumberToMoney(proyeccion)}
                  </span>
                  <span style={{ fontSize: 13, color: projectionTextColor, marginLeft: 4 }}>{projectionText}</span>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ flexDirection: "row", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: colors.text.secondary }}>Limite diario promedio</span>
                <span style={{ fontSize: 13, color: colors.text.primary, marginLeft: 4 }}>
                  {NumberToMoney(data.gastoMaxDiario)}
                </span>
              </div>
              <div style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: colors.text.secondary }}>Promedio gastado por dia</span>
                <span style={{ fontSize: 13, color: colors.text.primary, marginLeft: 4 }}>
                  {NumberToMoney(data.gastosPromedioMensual)}
                </span>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
