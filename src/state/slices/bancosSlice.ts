//import { any } from "../../types";

// ==================== BANCOS SLICE ====================
export interface BancosState {
  bancos: any[];
  editingId: string;
}

export type BancosActions =
  | { type: 'bancos/get', payload: any[] }
  | { type: 'bancos/add', payload: { banco: any } }
  | { type: 'bancos/read', payload: { id: any['id'] } }
  | { type: 'bancos/update', payload: { banco: any } }
  | { type: 'bancos/remove', payload: { id: any['id'] } };

export const bancosInitialState: BancosState = {
  bancos: [],
  editingId: ''
};

export const bancosReducer = (state: BancosState, action: BancosActions): BancosState => {
  switch (action.type) {
    case 'bancos/get':
      return { ...state, bancos: action.payload };
    case 'bancos/add':
      return { ...state, bancos: [...state.bancos, action.payload.banco] };
    case 'bancos/read':
      return { ...state, editingId: action.payload.id };
    case 'bancos/update':
      return { ...state, bancos: state.bancos.map(banco => banco.id === action.payload.banco.id ? action.payload.banco : banco) };
    case 'bancos/remove':
      return { ...state, bancos: state.bancos.filter(banco => banco.id !== action.payload.id) };
    default:
      return state;
  }
};

