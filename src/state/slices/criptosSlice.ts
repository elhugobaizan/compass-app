import { Cripto } from "../../types";

// ==================== BANCOS SLICE ====================
export interface CriptosState {
  criptos: Cripto[];
  editingId: string;
}

export type CriptosActions =
    | { type: 'criptos/get', payload: Cripto[] }
  | { type: 'criptos/add', payload: { cripto: Cripto } }
  | { type: 'criptos/read', payload: { id: Cripto['id'] } }
  | { type: 'criptos/update', payload: { cripto: Cripto } }
  | { type: 'criptos/remove', payload: { id: Cripto['id'] } };

export const criptosInitialState: CriptosState = {
  criptos: [],
  editingId: ''
};

export const criptosReducer = (state: CriptosState, action: CriptosActions): CriptosState => {
  switch (action.type) {
    case 'criptos/get':
      return { ...state, criptos: action.payload };
    case 'criptos/add':
      return { ...state, criptos: [...state.criptos, action.payload.cripto] };
    case 'criptos/read':
      return { ...state, editingId: action.payload.id };
    case 'criptos/update':
      return { ...state, criptos: state.criptos.map(cripto => cripto.id === action.payload.cripto.id ? action.payload.cripto : cripto) };
    case 'criptos/remove':
      return { ...state, criptos: state.criptos.filter(cripto => cripto.id !== action.payload.id) };
    default:
      return state;
  }
};

