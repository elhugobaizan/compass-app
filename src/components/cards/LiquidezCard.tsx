import HomeCard from "./HomeCard";
import { NumberToMoney } from "../../utils/utils";
import { useCoverageMetrics } from "../../hooks/useCoverageMetrics";
import { useFinanzas } from "../../state/finanzasStore";
import { useEffect } from "react";
import { colors } from "../../theme/colors";

export interface LiquidezCardData {
  readonly disponible: number;
  readonly totalImpuestos: number;
  readonly sueldo: number;
  readonly objetivoAhorro: number;
  readonly dolares: number;
}

type LiquidezCardProps = {
  readonly data: LiquidezCardData;
  readonly platform?: "web" | "mobile";
};

export function LiquidezCard({ data, platform = "web" }: LiquidezCardProps) {

  const { movimientos } = useFinanzas();
  const getAll = movimientos.getAll;

  useEffect(() => {
    getAll();
  }, [getAll]);

  const { coverageMonths } =
    useCoverageMetrics({
      movimientos: movimientos.state.movimientos ?? [],
      currentBalanceARS: data.disponible,
    });

  return (
    <HomeCard
      platform={platform}
      variant="default"
      fixed
      title="Liquidez y obligaciones"
      style={{ paddingTop: 16, paddingBottom: 0 }}
      value={
        <div style={{ paddingTop: 8 }}>
          <div style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ flexDirection: 'column' }}>
                <span style={{ color: colors.text.primary, fontWeight: '600', fontSize: 40, width: '100%' }}>{NumberToMoney(data.disponible)}</span>
                <span style={{ fontSize: 12 }}>Liquidez disponible</span>
              </div>
            </div>
          </div>
          <hr style={{ margin: "12px 0" }} />
          <div style={{ marginBottom: 12, justifyContent: "space-between" }}>
            <div>
              <span>USD Líquido</span>
            </div>
            <div>
              <span>{NumberToMoney(data.dolares)}</span>
            </div>
          </div>
          <span style={{ marginTop: 0 }}>Flujo mensual</span>
          <div style={{ justifyContent: "space-between" }}>
            <div>Sueldo mensual</div>
            <div>{NumberToMoney(data.sueldo)}</div>
          </div>
          <div style={{ justifyContent: "space-between" }}>
            <div>Fijos del mes</div>
            <div>- {NumberToMoney(data.totalImpuestos)}</div>
          </div>
          <hr style={{ margin: "12px 0" }} />
          <div style={{ justifyContent: "space-between" }}>
            <div>Cobertura</div>
            <div style={{ color: colors.text.inverse }}>{coverageMonths.toFixed(1)} meses</div>
          </div>
        </div>
      }
    />
  );
}
