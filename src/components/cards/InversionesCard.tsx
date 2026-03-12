import { FinancialAssetType, getFinancialColor } from "../../theme/financialColors";
import { NumberToMoney } from "../../utils/utils";
import HomeCard from "./HomeCard";
/* import { PercentBar } from "../../../components/PercentBar"; */
import { useMemo } from "react";
import { colors } from "../../theme/colors";
import { useNavigation } from "react-router-dom";

export interface InversionesCardData {
  readonly totalPlazosFijos: number;
  readonly fondos: number;
  readonly dolaresInversiones: number;
  readonly totalCriptos: number;
  readonly interesesMensuales: number;
  readonly cotizacionDolares: number;
}

type InversionesCardProps = {
  readonly data: InversionesCardData;
  readonly platform?: "web" | "mobile";
};

export function InversionesCard({ data, platform = "web" }: InversionesCardProps) {
  const navigation = useNavigation();

  const total = data.totalPlazosFijos + data.fondos + data.dolaresInversiones + data.totalCriptos;
  const segmentos = useMemo(() => [
    { value: data.totalPlazosFijos, color: getFinancialColor(FinancialAssetType.FixedDeposit), label: "Plazos fijos" },
    { value: data.fondos, color: getFinancialColor(FinancialAssetType.Funds), label: "Fondos" },
    { value: data.dolaresInversiones * data.cotizacionDolares, color: getFinancialColor(FinancialAssetType.USD), label: "USD" },
    { value: data.totalCriptos, color: getFinancialColor(FinancialAssetType.Crypto), label: "Cripto" },
  ].filter(s => s.value > 0), [data]);

  if (platform === "web") {
    return (
      <HomeCard
        platform={platform}
        variant="default"
        fixed
        title="Inversiones y ahorro"
        style={{ paddingTop: 16, paddingBottom: 0 }}
        value={
          <div style={{ paddingTop: 8 }}>
            <div style={{ justifyContent: "space-between" }}>
              <div>
                <div style={{ flexDirection: 'column' }}>
                  <span style={{ color: colors.text.primary, fontWeight: '600', fontSize: 32, width: '100%' }}>{NumberToMoney(total)}</span>
                  <span>Total invertido</span> {/* style={styles.homeValueMutedCompact} */}
                </div>
              </div>
            </div>
            {/* <PercentBar
              style={{ marginVertical: 28 }}
              showLabels
              spacing
              items={segmentos}
            /> */}
            <div style={{ justifyContent: "space-between" }}>
              <div>Plazos fijos</div>
              <div>{NumberToMoney(data.totalPlazosFijos)}</div>
            </div>
            <div style={{ justifyContent: "space-between" }}>
              <div>Fondos</div>
              <div>{NumberToMoney(data.fondos)}</div>
            </div>
            <div style={{ justifyContent: "space-between" }}>
              <div>USD Invertidos</div>
              <div>{NumberToMoney(data.dolaresInversiones)}</div>
            </div>
            <div style={{ justifyContent: "space-between" }}>
              <div>Cripto</div>
              <div>{NumberToMoney(data.totalCriptos)}</div>
            </div>
            <hr style={{ margin: "12px 0" }} />
            <span style={{ marginTop: 0, marginBottom: 0 }}>Rendimiento mensual</span>
            <div style={{ justifyContent: "space-between" }}>
              <div><span style={{ color: colors.financial.income }}>{NumberToMoney(data.interesesMensuales)}</span></div>
            </div>
          </div>
        }
      />
    );
  }

  return (<><span>Inversiones y ahorro</span>
    <div>
      <HomeCard platform="mobile"
        fixed
        variant="default" title="" value={
          <div>
            <div style={{ justifyContent: "space-between" }}>
              <div>
                <div style={{ flexDirection: "column", gap: 2 }}>
                  <span>{NumberToMoney(total)}</span>
                  <span>Total invertido</span>
                </div>
              </div>
            </div>
            {/*             <PercentBar
              style={{ marginVertical: 12 }}
              spacing
              items={[
                { value: data.totalPlazosFijos, color: getFinancialColor(FinancialAssetType.FixedDeposit), label: "Plazos fijos" },
                { value: data.fondos, color: getFinancialColor(FinancialAssetType.Funds), label: "Fondos" },
                { value: (data.dolaresInversiones * (data.cotizacionDolares)), color: getFinancialColor(FinancialAssetType.USD), label: "USD" },
                { value: data.totalCriptos, color: getFinancialColor(FinancialAssetType.Crypto), label: "Cripto" },
              ]}
            /> */}
            <div style={{ justifyContent: "space-between" }}>
              <div><span>Plazos fijos</span></div>
              <div><span>{NumberToMoney(data.totalPlazosFijos)}</span></div>
            </div>
            <div style={{ justifyContent: "space-between" }}>
              <div><span>Fondos</span></div>
              <div><span>{NumberToMoney(data.fondos)}</span></div>
            </div>
            <div style={{ justifyContent: "space-between" }}>
              <div><span>USD invertidos</span></div>
              <div><span>{NumberToMoney(data.dolaresInversiones)}</span></div>
            </div>
            <div style={{ justifyContent: "space-between" }}>
              <div><span>Cripto</span></div>
              <div><span>{NumberToMoney(data.totalCriptos)}</span></div>
            </div>
            <hr style={{ margin: "12px 0" }} />
            <div style={{}}>
              <div>
                <div style={{ flexDirection: "column", gap: 2 }}>
                  <span>Rendimiento mensual</span>
                  <span style={{ color: colors.text.inverse }}>{NumberToMoney(data.interesesMensuales)}</span>
                </div>
              </div>
            </div>
          </div>
        } onPress={() => console.log("navigate to Banks")} />
    </div></>);
}
