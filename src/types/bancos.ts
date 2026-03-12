export type Banco = {
  id: string,
  Nombre: string,
  Efectivo: number,
  CBU: string,
  Alias: string,
  Logo: string,
  EsMetodo: boolean,
  PlazosFijos: PlazosFijo[],
}

export type BancoBase = Pick<Banco, 'id' | 'Efectivo' | 'PlazosFijos'>

export type BancoMetricsResult<T extends BancoBase> = {
  totalLiquidez: number,
  totalPlazosFijos: number,
  totalInteresMensual: number,
  totalBancos: number,
  tnaPromedio: number,
  maxTNA: number,
}

export type BancoListProps = {
  readonly bancos: Banco[];
  readonly onSelectBanco: (banco: Banco) => void;
};

export type BancoInfoProps = {
  readonly banco: Banco,
  readonly onPress: (banco: Banco) => void
}

export type BancoHeaderProps = {
  readonly vistaTabla: boolean
  readonly onAddBanco: () => void
  readonly onToggleVistaTabla: () => void
}

export type BancoHeroProps = Readonly<{
  bancos: BancoBase[];
}>;

export type ModalBancoProps = {
  readonly isVisible: boolean;
  readonly setIsVisible: (isVisible: boolean) => void;
  readonly selected: Banco;
  readonly exists: boolean;
  readonly remove: () => void;
  readonly closeModal: () => void;
}

export type PlazosFijo = {
  id: string,
  Nombre: string,
  Periodo: string,
  Vencimiento: string,
  Capital: number,
  TNA: number,
  Banco: Banco['id'],
}