import { Inversion } from "../../types";

// ==================== BANCOS SLICE ====================
export interface InversionesState {
  inversiones: Inversion[];
  editingId: string;
}

export type InversionesActions =
    | { type: 'inversiones/get', payload: Inversion[] }
  | { type: 'inversiones/add', payload: { inversion: Inversion } }
  | { type: 'inversiones/read', payload: { id: Inversion['id'] } }
  | { type: 'inversiones/update', payload: { inversion: Inversion } }
  | { type: 'inversiones/remove', payload: { id: Inversion['id'] } };

export const inversionesInitialState: InversionesState = {
  inversiones: [],
  editingId: ''
};

export const inversionesReducer = (state: InversionesState, action: InversionesActions): InversionesState => {
  switch (action.type) {
    case 'inversiones/get':
      return { ...state, inversiones: action.payload };
    case 'inversiones/add':
      return { ...state, inversiones: [...state.inversiones, action.payload.inversion] };
    case 'inversiones/read':
      return { ...state, editingId: action.payload.id };
    case 'inversiones/update':
      return { ...state, inversiones: state.inversiones.map(inversion => inversion.id === action.payload.inversion.id ? action.payload.inversion : inversion) };
    case 'inversiones/remove':
      return { ...state, inversiones: state.inversiones.filter(inversion => inversion.id !== action.payload.id) };
    default:
      return state;
  }
};

