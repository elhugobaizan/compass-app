import { useHomeData } from "@/hooks/useHomeData";
import { HoyCard } from "@/components/cards/HoyCard";
import { InversionesCard } from "@/components/cards/InversionesCard";
import { LiquidezCard } from "@/components/cards/LiquidezCard";
import { PatrimonioCard } from "@/components/cards/PatrimonioCard";
/* import { GoalCard } from "../../components/cards/GoalCard"; */
import { useEffect, useState } from "react";
import { useViajes } from "@/state/finanzasStore";
import { useNavigation } from "react-router-dom";
import { TravelDetails } from "@/types/viajes";

/** Vista Home para web/escritorio. Sustituir por el diseño que quieras. */
export default function HomeWeb() {
  const data = useHomeData();
  const navigation = useNavigation();
  const { get } = useViajes();

  const [travelDetail, setTravelDetail] = useState<TravelDetails | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const travels = await get();
      if (travels.length > 0) {
        setTravelDetail(travels[0]);
      }
    })();
  }, [get]);

  return (
    <div>
      <div>
        <PatrimonioCard
          data={{
            netoActual: data.netoActual,
            netoFinanciero: data.netoFinanciero,
            netoReal: data.netoReal,
          }}
          platform="web"
        />
        <div>
          <div>
            <LiquidezCard
              data={{
                disponible: data.disponible,
                totalImpuestos: data.totalImpuestos,
                sueldo: data.sueldo,
                objetivoAhorro: data.objetivoAhorro,
                dolares: data.dolaresEfectivo,
              }}
              platform="web"
            />
          </div>
          <div>
            <InversionesCard
              data={{
                totalPlazosFijos: data.totalPlazosFijos,
                fondos: data.fondos,
                dolaresInversiones: data.totalInversionesDolares,
                totalCriptos: data.totalCriptos,
                interesesMensuales: data.interesesMensuales,
                cotizacionDolares: data.cotizacionesOficial?.venta ?? 0,
              }}
              platform="web"
            />
          </div>
        </div>
        <HoyCard
          data={{
            totalGastosHoy: data.totalGastosHoy,
            gastoMaxDiario: data.gastoMaxDiario,
            interesesDelDia: data.interesesDelDia,
            gastosPromedioMensual: data.gastosPromedioMensual,
          }}
          platform="web"
        />
        {/* <GoalCard
          variant="full"
          travelDetail={travelDetail}
          onPress={() => navigation.navigate("ObjetivosStack", { screen: "ViajesDetails", params: { travelDetail } } as const)}
        /> */}
      </div>
    </div>
  );
}