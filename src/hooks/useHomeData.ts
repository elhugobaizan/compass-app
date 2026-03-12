import { DateTime } from "luxon";
import { useMemo, useState, useEffect } from "react";
import { useFinanzas } from "@/state/finanzasStore";
import { calculateDiario, calculateMensual, gastoMaximoDiario, getApiUrl, normalizarVencimiento } from "@/utils/utils";
import { useWalletMetrics } from "@/hooks/useWalletsMetrics";
import { type PlazosFijo } from "@/types/bancos";
import axios from "axios";
import { TipoMovimiento } from "@/types";

/**
 * Cálculos compartidos del Home. Usado por HomeMobile y HomeWeb.
 */
export function useHomeData() {
  const { wallets, bancos, impuestos, movimientos, usuario, criptos, inversiones, cotizaciones } = useFinanzas();
  const { totalBalance: totalWallets } = useWalletMetrics([]);//(wallets.state.wallets);



  const totalBancos = useMemo(
    () => 0, //bancos?.state?.bancos?.reduce((acc, b) => acc + b.Efectivo, 0) ?? 0,
    [] //[bancos.state.bancos]
  );
  const totalCriptos = useMemo(
    () => 0, //criptos?.state?.criptos?.reduce((acc, c) => acc + ((c.Cantidad ?? 0) * (c.Hoy ?? 0)), 0) ?? 0,
    [] //[criptos.state.criptos]
  );

  const disponible = useMemo(() => {
    const efectivo = usuario.state.info.find((i) => i.Campo === "efectivo")?.Valor ?? 0;
    const reserva = wallets.state.reserva?.Valor ?? 0;
    return totalWallets + totalBancos + efectivo - reserva;
  }, [totalWallets, totalBancos, usuario.state.info, wallets.state.reserva]);

  const totalImpuestos = useMemo(
    () => impuestos?.state?.impuestos?.reduce((acc, i) => acc + i.Deuda, 0) ?? 0,
    [impuestos.state.impuestos]
  );

  const totalPlazosFijos = useMemo(() => {
    const pfBancos = bancos.state.bancos.reduce(
      (acc, b) => acc + (b.PlazosFijos?.reduce((a: number, p: PlazosFijo) => a + p.Capital, 0) ?? 0),
      0
    );
    return pfBancos + (wallets.state.reserva?.Valor ?? 0);
  }, [bancos.state.bancos, wallets.state.reserva]);

  const interesesBancos = useMemo(
    () =>
      bancos.state.bancos?.reduce(
        (acc, b) => acc + (b.PlazosFijos?.reduce((a: number, p: PlazosFijo) => a + calculateMensual(p), 0) ?? 0),
        0
      ) ?? 0,
    [bancos.state.bancos]
  );
  const interesesWallets = useMemo(
    () => wallets.state.wallets?.reduce((acc, w) => acc + calculateDiario(w), 0) ?? 0,
    [wallets.state.wallets]
  );

  const totalInversionesDolares = useMemo(
    () =>
      inversiones.state.inversiones.reduce(
        (acc, inv) => acc + (inv.Moneda === 2 ? (inv.Capital ?? 0) : 0),
        0
      ),
    [inversiones.state.inversiones]
  );
  const dolaresEfectivo = useMemo(() => usuario.state.info.find((i) => i.Campo === "dolares")?.Valor ?? 0, [usuario.state.info]);
  const dolares = useMemo(
    () =>
      dolaresEfectivo + totalInversionesDolares,
    [dolaresEfectivo, totalInversionesDolares]
  );

  const totalGastosHoy = useMemo(() => {
    if (!movimientos.state.movimientos?.length) return 0;
    const hoy = DateTime.now().startOf("day");
    return movimientos.state.movimientos.reduce((suma, g) => {
      const norm = normalizarVencimiento(g.Fecha ?? "");
      if (!norm) return suma;
      const dt = DateTime.fromFormat(norm, "yyyy-MM-dd").startOf("day");
      return dt.isValid && hoy.equals(dt) && g.Codigo === TipoMovimiento.Gasto ? suma + g.Monto : suma;
    }, 0);
  }, [movimientos.state.movimientos]);

  const netoFinanciero = useMemo(() => {
    return disponible +
      totalWallets +
      totalCriptos +
      totalPlazosFijos +
      dolares * (cotizaciones.oficial?.venta ?? 0);
  }, [disponible, totalWallets, totalCriptos, totalPlazosFijos, dolares, cotizaciones.oficial]);

  const netoReal = useMemo(() => {
    const auto = usuario.state.info.find((i) => i.Campo === "auto")?.Valor ?? 0;
    const casa = usuario.state.info.find((i) => i.Campo === "casa")?.Valor ?? 0;
    return auto + ((cotizaciones.oficial?.venta ?? 0) * casa);
  }, [usuario.state.info, cotizaciones.oficial]);

  const netoActual = useMemo(() => {
    return netoFinanciero + netoReal;
  }, [
    disponible,
    totalWallets,
    totalCriptos,
    totalPlazosFijos,
    dolares,
    netoFinanciero,
    netoReal,
  ]);

  const sueldo = useMemo(
    () => usuario.state.info.find((i) => i.Campo === "sueldo")?.Valor ?? 0,
    [usuario.state.info]
  );
  const reservaValor = useMemo(
    () => usuario.state.info.find((i) => i.Campo === "reserva")?.Valor ?? 0,
    [usuario.state.info]
  );
  const deudaAFavor = useMemo(
    () => usuario.state.info.find((i) => i.Campo === "deuda")?.Valor ?? 0,
    [usuario.state.info]
  );

  const [baseMensual, setBaseMensual] = useState<number>(0);

  useEffect(() => {
    const fetchBaseMensual = async () => {
      try {
        const res = await axios.get(`${getApiUrl()}utiles/resumen?periodo=${DateTime.now().toFormat('yyyy-MM')}`);
        if (res.data) {
          const data = res.data.snapshots[0];
          const liquidez = data.Liquidez ?? 0;
          setBaseMensual((liquidez + sueldo) / DateTime.now().daysInMonth);
        }
      } catch (error) {
        console.error('Error fetching resumen:', error);
        setBaseMensual((disponible + sueldo) / DateTime.now().daysInMonth);
      }
    };

    fetchBaseMensual();
  }, [sueldo, disponible]);

  const gastoMaxDiario = useMemo(
    () => gastoMaximoDiario(disponible, 0),
    [disponible, totalGastosHoy]
  );
  const interesesMensuales = useMemo(
    () => interesesBancos + interesesWallets * 30,
    [interesesBancos, interesesWallets]
  );

  const gastosDelMes = useMemo(() => {
    if (!movimientos.state.movimientos?.length) return 0;
    const ahora = DateTime.now();
    return movimientos.state.movimientos.reduce((suma, g) => {
      const norm = normalizarVencimiento(g.Fecha ?? "");
      if (!norm) return suma;
      const dt = DateTime.fromFormat(norm, "yyyy-MM-dd");
      if (dt.isValid && dt.month === ahora.month && dt.year === ahora.year && g.Codigo === TipoMovimiento.Gasto) {
        return suma + g.Monto;
      }
      return suma;
    }, 0);
  }, [movimientos.state.movimientos]);

  const gastosPromedioMensual = useMemo(() => {
    const gastosMes = gastosDelMes;
    const diaActual = DateTime.now().day;
    return diaActual > 0 ? (gastosMes / diaActual) : 0;
  }, [gastosDelMes]);

  const objetivoAhorro = useMemo(
    () => ((disponible / DateTime.now().daysInMonth) * DateTime.now().day) - gastosDelMes,
    [disponible, gastosDelMes]
  );

  const interesesDelDia = useMemo(
    () => interesesMensuales / DateTime.now().daysInMonth,
    [interesesMensuales]
  );

  const fondos = useMemo(() => totalWallets + totalCriptos, [totalWallets, totalCriptos]);

  return {
    totalWallets,
    totalBancos,
    totalCriptos,
    disponible,
    totalImpuestos,
    totalPlazosFijos,
    interesesBancos,
    interesesWallets,
    totalInversionesDolares,
    dolaresEfectivo,
    dolares,
    totalGastosHoy,
    gastosPromedioMensual,
    baseMensual,
    netoActual,
    netoFinanciero,
    netoReal,
    sueldo,
    reservaValor,
    deudaAFavor,
    gastoMaxDiario,
    interesesMensuales,
    objetivoAhorro,
    interesesDelDia,
    fondos,
    cotizacionesOficial: cotizaciones.oficial,
  };
}
