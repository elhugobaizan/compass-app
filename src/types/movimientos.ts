export type Movimiento = {
  id: string,
  Concepto: string,
  Tipo: number,
  Monto: number,
  Fecha: string,
  Donde: string,
  Metodo: string,
  Codigo: number,
}

export type MovimientoBase = Pick<Movimiento, 'id' | 'Monto' | 'Tipo' | 'Fecha'>;

export type MovimientoMetricsResult<T extends MovimientoBase> = {
  totalGastosHoy: number;
  totalGastos: number;
  totalGastosMes: number;
  gastosFijosMes: number;
  gastosVariablesMes: number;
  itemsByCategoria: ChartItem[];
  proyeccionMensual: number;
  ritmoMensual: number;
  desvioProyectado: number;
};

export type MovimientoHeaderProps = {
  readonly onAddMovimiento: () => void;
  readonly onViewChart: () => void;
  readonly onToggleVistaTodos: () => void;
  readonly onToggleVistaTabla: () => void;
  readonly vistaTodos: boolean;
  readonly vistaTabla: boolean;
}

export type MovimientoHeroProps = Readonly<{
  movimientos: MovimientoBase[];
}>;

export type ChartItem = {
  readonly value: number;
  readonly color: string;
  readonly text: string;
  readonly label: string;
};