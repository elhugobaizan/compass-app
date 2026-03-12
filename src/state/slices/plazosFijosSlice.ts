import { Banco, PlazosFijo } from "../../types";

// ==================== PLAZOS FIJOS SLICE ====================
export interface PlazosFijosState {
  plazos: PlazosFijo[];
  editingId: string;
}

export type PlazosFijosActions =
  | { type: 'plazos-fijos/get', payload: PlazosFijo[] }
  | { type: 'plazos-fijos/get-by-banco', payload: { bancoId: Banco['id'] } }
  | { type: 'plazos-fijos/add', payload: { plazo: PlazosFijo } }
  | { type: 'plazos-fijos/read', payload: { id: PlazosFijo['id'] } }
  | { type: 'plazos-fijos/update', payload: { plazo: PlazosFijo } }
  | { type: 'plazos-fijos/remove', payload: { id: PlazosFijo['id'] } };

export const plazosFijosInitialState: PlazosFijosState = {
  plazos: [],
  editingId: ''
};

export const plazosFijosReducer = (state: PlazosFijosState, action: PlazosFijosActions): PlazosFijosState => {
  switch (action.type) {
    case 'plazos-fijos/get':
      return { ...state, plazos: action.payload };
    case 'plazos-fijos/get-by-banco':
      return { ...state, plazos: state.plazos.filter(plazo => plazo.Banco === action.payload.bancoId) };
    case 'plazos-fijos/add':
      return { ...state, plazos: [...state.plazos, action.payload.plazo] };
    case 'plazos-fijos/read':
      return { ...state, editingId: action.payload.id };
    case 'plazos-fijos/update':
      return { ...state, plazos: state.plazos.map(plazo => plazo.id === action.payload.plazo.id ? action.payload.plazo : plazo) };
    case 'plazos-fijos/remove':
      return { ...state, plazos: state.plazos.filter(plazo => plazo.id !== action.payload.id) };
    default:
      return state;
  }
};

