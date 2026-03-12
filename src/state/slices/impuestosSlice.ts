import { Impuesto } from "../../pages/Impuestos/types";

// ==================== IMPUESTOS SLICE ====================
export interface ImpuestosState {
  impuestos: Impuesto[];
  editingId: string;
}

export type ImpuestosActions =
  | { type: 'impuestos/get', payload: Impuesto[] }
  | { type: 'impuestos/add', payload: { impuesto: Impuesto } }
  | { type: 'impuestos/read', payload: { id: Impuesto['id'] } }
  | { type: 'impuestos/update', payload: { impuesto: Impuesto } }
  | { type: 'impuestos/remove', payload: { id: Impuesto['id'] } }

export const impuestosInitialState: ImpuestosState = {
  impuestos: [],
  editingId: ''
};

export const impuestosReducer = (state: ImpuestosState, action: ImpuestosActions): ImpuestosState => {
  switch (action.type) {
    case 'impuestos/get':
      return { ...state, impuestos: action.payload };
    case 'impuestos/add':
      return { ...state, impuestos: [...state.impuestos, action.payload.impuesto] };
    case 'impuestos/read':
      return { ...state, editingId: action.payload.id };
    case 'impuestos/update':
      return { ...state, impuestos: state.impuestos.map(impuesto => impuesto.id === action.payload.impuesto.id ? action.payload.impuesto : impuesto) };
    case 'impuestos/remove':
      return { ...state, impuestos: state.impuestos.filter(impuesto => impuesto.id !== action.payload.id) };
    default:
      return state;
  }
};

