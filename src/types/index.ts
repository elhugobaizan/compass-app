/* import type { TravelDetails } from "../pages/Objetivos/Viajes/types"; */

export enum TipoGasto {
  Comida = 1,
  Bebida = 2,
  Salud = 3,
  Ocio = 4,
  Servicios = 5,
  Varios = 6,
  Impuestos = 7,
}

export enum TipoMovimiento {
  Gasto = 1,
  Ingreso = 2,
  Transferencia_Entrada = 3,
  Transferencia_Salida = 4,
  Ajuste = 5
}

/** Colores alineados con la paleta de la app (slate, teal, emerald, rose) y tendencia actual. */
export const iconoTipoGasto = [
  { id: 1, nombre: 'bowl-food', color: 'rgb(16, 185, 129)', label: 'Comida', value: TipoGasto.Comida },       // emerald-500 = successText
  { id: 2, nombre: 'wine-bottle', color: 'rgb(194, 65, 12)', label: 'Bebida', value: TipoGasto.Bebida },      // orange-700
  { id: 3, nombre: 'hospital', color: 'rgb(225, 29, 72)', label: 'Salud', value: TipoGasto.Salud },           // rose-600 = homeNegative
  { id: 4, nombre: 'masks-theater', color: 'rgb(124, 58, 237)', label: 'Ocio', value: TipoGasto.Ocio },       // violet-600
  { id: 5, nombre: 'gas-pump', color: 'rgb(161, 98, 7)', label: 'Servicios', value: TipoGasto.Servicios },   // amber-700
  { id: 6, nombre: 'hand-holding-dollar', color: 'rgb(14, 116, 144)', label: 'Varios', value: TipoGasto.Varios },   // teal-700 = accent
  { id: 7, nombre: 'money-bill-wave', color: 'rgb(71, 85, 105)', label: 'Impuestos', value: TipoGasto.Impuestos }    // slate-600 = homeSection
]

export type Inversion = {
  id: string,
  Nombre: string,
  Capital: number | null,
  Moneda: number,
}

export type Cripto = {
  id: string,
  Nombre: string,
  Cantidad: number | null,
  Logo: string,
  Sigla: string,
  Hoy: number | null,
}

export type UsuarioInfo = {
  Campo: string;
  Valor: number;
  id: string;
}

export type BaseStylesProps = {
  isMobile: boolean,
  isTablet: boolean,
  isDesktop: boolean,
}