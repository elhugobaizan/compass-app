export type Wallet = {
  id: string,
  Nombre: string,
  Inicio: Date | null,
  Interes: number,
  Efectivo: number,
  Logo: string
  CVU: string,
  Alias: string,
  EsMetodo: boolean,
};

export type WalletTableProps = Readonly<{
  wallets: Wallet[];
  onUpdate: (wallet: Wallet) => Promise<void>;
  setLoading: (loading: boolean) => void;
}>;

export type WalletDetailsPanelProps = Readonly<{
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  selected: Wallet;
  remove: () => void;
  closeModal: () => void;
}>;

export type WalletTableSummaryProps = Readonly<{ pageData: readonly Wallet[] }>;
