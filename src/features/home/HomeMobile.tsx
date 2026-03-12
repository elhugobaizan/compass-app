//import { Col, Divider, Row } from "antd";
import { useEffect, useState } from "react";
import { useHomeData } from "../../hooks/useHomeData";
import { useCoverageMetrics } from "../../hooks/useCoverageMetrics";
import { useFinanzas, useViajes } from "../../state/finanzasStore";
import { useNavigation } from "react-router-dom";
import { NumberToMoney } from "../../utils/utils";
import HomeCard from "../../components/cards/HomeCard";
import { GoalCard } from "../../components/cards/GoalCard";
import { InversionesCard } from "../../components/cards/InversionesCard";
import { PatrimonioCard } from "../../components/cards/PatrimonioCard";
/*
import { TravelDetails } from "../Objetivos/Viajes/types";
 */
export default function HomeMobile() {
  const data = useHomeData();
  const { movimientos } = useFinanzas();
  const getAll = movimientos.getAll;
  const { get } = useViajes();
  const [travelDetail, setTravelDetail] = useState<any | undefined>(undefined);

  useEffect(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    (async () => {
      const travels = await get();
      if (travels.length > 0) {
        setTravelDetail(travels[0]);
      }
    })();
  }, [get]);

  const coverageMetrics = useCoverageMetrics({
    movimientos: movimientos.state.movimientos ?? [],
    currentBalanceARS: data.disponible,
  });
  const navigation = useNavigation();

  return (
    <div>
      <div>
        <PatrimonioCard
          data={{
            netoActual: data.netoActual,
            netoFinanciero: data.netoFinanciero,
            netoReal: data.netoReal,
            cotizacionesOficial: data.cotizacionesOficial,
          }}
          platform="mobile"
        />
      </div>

      <span>Liquidez y obligaciones</span>
      <div>
        <HomeCard
          platform="mobile"
          fixed
          variant="default" title="" value={
            <div>
              <div>
                <div>
                  <div style={{ flexDirection: "column", gap: 2 }}>
                    <span>{NumberToMoney(data.disponible)}</span>
                    <span>Liquidez disponible</span>
                  </div>
                </div>
              </div>
              <hr style={{ margin: "12px 0" }} />
              <div style={{ justifyContent: "space-between" }}>
                <div><span>Sueldo mensual</span></div>
                <div><span>{NumberToMoney(data.sueldo)}</span></div>
              </div>
              <div style={{ justifyContent: "space-between" }}>
                <div><span>Fijos del mes</span></div>
                <div>
                  <span>- {NumberToMoney(data.totalImpuestos)}</span>
                </div>
              </div>
              <hr style={{ margin: "12px 0" }} />
              <div style={{ justifyContent: "space-between" }}>
                <div><span>Cobertura</span></div>
                <div><span>{coverageMetrics.coverageMonths.toFixed(1)} meses</span></div>
              </div>
            </div>
          } onPress={() => console.log("navigate to WalletsStack")} />
      </div>

      <InversionesCard data={{
        totalPlazosFijos: data.totalPlazosFijos,
        fondos: data.fondos,
        dolaresInversiones: data.totalInversionesDolares,
        totalCriptos: data.totalCriptos,
        interesesMensuales: data.interesesMensuales,
        cotizacionDolares: data.cotizacionesOficial?.venta ?? 0,
      }} platform="mobile" />

      <span>Hoy</span>
      <div>
        <HomeCard variant="compact" title="" value={
          <div>
            <div style={{ justifyContent: "space-between" }}>
              <div><span>Gastado hoy</span></div>
              <div><span>{NumberToMoney(data.totalGastosHoy)}</span></div>
            </div>
            <div style={{ justifyContent: "space-between" }}>
              <div><span>Podés gastar hoy</span></div>
              <div><span>{NumberToMoney(data.gastoMaxDiario)}</span></div>
            </div>
          </div>
        } onPress={() => console.log("navigate to MovimientosStack")} />
      </div>

      <span>Otros</span>
      <div>
        <HomeCard variant="compact" title="" value={
          <div>
            <div style={{ justifyContent: "space-between" }}>
              <div><span>Me deben</span></div>
              <div><span>{NumberToMoney(data.deudaAFavor)}</span></div>
            </div>
          </div>
        } fixed />
      </div>
      <GoalCard
        variant="compact"
        travelDetail={travelDetail}
        onPress={() => console.log("navigate to ObjetivosStack")}
      />
    </div>
  );
}
