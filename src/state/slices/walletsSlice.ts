//import { Wallet } from "../../types";

// ==================== WALLETS SLICE ====================
export interface WalletsState {
  wallets: any[];
  editingId: string;
  reserva: any;
}

export type WalletsActions =
  | { type: 'wallets/get', payload: any[] }
  | { type: 'wallets/add', payload: { wallet: any } }
  | { type: 'wallets/read', payload: { id: any['id'] } }
  | { type: 'wallets/update', payload: { wallet: any } }
  | { type: 'wallets/remove', payload: { id: any['id'] } }
  | { type: 'wallets/get-reserva', payload: any }
  | { type: 'wallets/update-reserva', payload: { reserva: any } }

export const walletsInitialState: WalletsState = {
  wallets: [],
  editingId: '',
  reserva: {} as any
};

export const walletsReducer = (state: WalletsState, action: WalletsActions): WalletsState => {
  switch (action.type) {
    case 'wallets/get':
      return { ...state, wallets: action.payload };
    case 'wallets/add':
      return { ...state, wallets: [...state.wallets, action.payload.wallet] };
    case 'wallets/read':
      return { ...state, editingId: action.payload.id };
    case 'wallets/update':
      return { ...state, wallets: state.wallets.map(wallet => wallet.id === action.payload.wallet.id ? action.payload.wallet : wallet) };
    case 'wallets/remove':
      return { ...state, wallets: state.wallets.filter(wallet => wallet.id !== action.payload.id) };
    case 'wallets/update-reserva':
      return { ...state, reserva: action.payload.reserva ?? {} as any };
    case 'wallets/get-reserva':
      return { ...state, reserva: action.payload ?? {} as any };
    default:
      return state;
  }
};

