export type Impuesto = {
  id: string,
  Vencimiento: string,
  Datos: string,
  URL: string,
  Detalle: string,
  Deuda: number,
  Logo: string,
}

export type ImpuestoBase = Pick<Impuesto, 'id' | 'Deuda'>

export type ImpuestoMetricsResult<T extends ImpuestoBase> = {
  totalImpuestos: number,
}

export type ImpuestoListProps = {
  readonly impuestos: Impuesto[];
  readonly onSelectImpuesto: (impuesto: Impuesto) => void;
};

export type ImpuestoHeaderProps = {
  readonly vistaTabla: boolean
  readonly onAddImpuesto: () => void
  readonly onToggleVistaTabla: () => void
}

export type ImpuestoHeroProps = Readonly<{
  impuestos: ImpuestoBase[];
}>;  