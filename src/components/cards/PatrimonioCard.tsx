import { useState } from "react";
import { useFinanzas, type CotizacionCasa } from "../../state/finanzasStore";
import { NumberToMoney } from "../../utils/utils";
/* import { EditarActivosRealesModal } from "../../../components/EditarActivosRealesModal"; */
import HomeCard from "./HomeCard";
import { theme } from "../../theme";
/* import { PercentBar } from "../../../components/PercentBar"; */

export interface PatrimonioCardData {
  readonly netoActual: number;
  readonly netoFinanciero: number;
  readonly netoReal: number;
  readonly cotizacionesOficial?: CotizacionCasa | null;
}

type PatrimonioCardProps = {
  readonly data: PatrimonioCardData;
  readonly platform: "web" | "mobile";
  readonly style?: any
};

export function PatrimonioCard({ data, platform, style }: PatrimonioCardProps) {
  const { netoActual, netoFinanciero, netoReal } = data;
  const [activosRealesModalVisible, setActivosRealesModalVisible] = useState(false);
  const { usuario } = useFinanzas();
  const autoInfo = usuario.state.info.find((i) => i.Campo === "auto") ?? { Campo: "auto", Valor: 0, id: "" };
  const casaInfo = usuario.state.info.find((i) => i.Campo === "casa") ?? { Campo: "casa", Valor: 0, id: "" };
  const heroValueStyle = platform === "web" ? "styles.homeHeroValueWeb" : "styles.homeHeroValueMobile";
  const paddingTop = platform === "web" ? 28 : 0;

  if (platform === "web") {
    return (
      <>
        <HomeCard
          platform="web"
          variant="hero"
          fixed
          style={[{ ...style }, { marginBottom: 24 }]}
          title="Patrimonio Neto"
          titleDivider={false}
          value={
            <div style={{ paddingTop: 28 }}>
              <div style={{ paddingBottom: 12 }}><div><span>{NumberToMoney(netoActual)}</span></div></div>
              <div style={{ justifyContent: "start" }}>
                <div>
                  <div style={{ justifyContent: "space-between" }}>
                    <div><span style={{ color: 'rgba(100, 116, 139, 0.65)' }}>Financieros </span></div>
                    <div style={{ textAlign: "end" }}><span>{NumberToMoney(netoFinanciero)}</span></div>
                  </div>
                </div>
              </div>
              <div style={{ justifyContent: "start" }}>
                <div>
                  <div style={{ justifyContent: "space-between" }}>
                    <div><span style={{ color: 'rgba(100, 116, 139, 0.65)' }}>Reales </span></div>
                    <div style={{ textAlign: "end" }}><span>{NumberToMoney(netoReal)}</span></div>
                  </div>
                </div>
                <div style={{ textAlign: "start", paddingLeft: 16, display: "flex", justifyContent: "flex-start" }}>
                  <button
                    style={{ marginLeft: 50, paddingLeft: 0, color: theme.colors.primary.link, fontSize: 12 }}
                    onClick={() => setActivosRealesModalVisible(true)}
                  >
                    Editar activos reales
                  </button>
                </div>
              </div>
              <div>
                <div>
                  {/*                   <PercentBar
                    items={[
                      { value: netoFinanciero, color: palette.accent, label: "Financieros" },
                      { value: netoReal, color: "#059669", label: "Reales" },
                    ]}
                    height={8}
                    showLabels
                    size={350}
                    style={{ marginTop: 12 }}
                  /> */}
                </div>
              </div>
            </div>
          }
        />
        {/*         <EditarActivosRealesModal
          visible={activosRealesModalVisible}
          onClose={() => setActivosRealesModalVisible(false)}
          autoVal={autoInfo.Valor}
          casaVal={casaInfo.Valor}
          autoId={autoInfo.id}
          casaId={casaInfo.id}
          onSave={(auto, casa) => usuario.update([auto, casa])}
        /> */}
      </>
    );
  }

  return (
    <HomeCard
      variant="hero"
      fixed
      icon={<img alt="" src={`./assets/1.Sueldo.jpg`} width={56} height={56} style={{ borderRadius: 12 }} />}
      title="Patrimonio neto"
      value={<div style={{ paddingTop: paddingTop }}>
        <div style={{ paddingBottom: 12 }}>
          <div>
            <span>{NumberToMoney(netoActual)}</span>
          </div>
        </div>
        <div style={{ justifyContent: "start" }}>
          <div>
            <div style={{ justifyContent: "space-around" }}>
              <div><span style={{ color: 'rgba(100, 116, 139, 0.65)' }}>Financieros </span></div>
              <div style={{ textAlign: "end" }}><span>{NumberToMoney(netoFinanciero)}</span></div>
            </div>
          </div>
        </div>
        <div style={{ justifyContent: "start" }}>
          <div>
            <div style={{ justifyContent: "space-around" }}>
              <div><span style={{ color: 'rgba(100, 116, 139, 0.65)' }}>Reales </span></div>
              <div style={{ textAlign: "end" }}><span>{NumberToMoney(netoReal)}</span></div>
            </div>
          </div>
        </div>
        <div>
          <div>
            {/*             <PercentBar
              items={[
                { value: netoFinanciero, color: palette.accent, label: "Financieros" },
                { value: netoReal, color: "#059669", label: "Reales" },
              ]}
              height={8}
              showLabels
              style={{ marginTop: 12 }}
            /> */}
          </div>
        </div>
      </div>}
    />
  );
}
