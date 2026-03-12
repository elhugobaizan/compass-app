import { UsuarioInfo } from "../../types";

// ==================== PRINCIPAL SLICE ====================
export interface UsuarioState {
  info: UsuarioInfo[];
}

export type UsuarioActions =
  | { type: 'usuario/get-deuda', payload: { info: UsuarioInfo } }
  | { type: 'usuario/get-reserva', payload: { info: UsuarioInfo } }
  | { type: 'usuario/update-reserva', payload: { info: UsuarioInfo } }
  | { type: 'usuario/update-deuda', payload: { info: UsuarioInfo } }
  | { type: 'usuario/get-sueldo', payload: { info: UsuarioInfo } }
  | { type: 'usuario/update-sueldo', payload: { info: UsuarioInfo } }
  | { type: 'usuario/get-efectivo', payload: { info: UsuarioInfo } }
  | { type: 'usuario/update-efectivo', payload: { info: UsuarioInfo } }
  | { type: 'usuario/get-dolares', payload: { info: UsuarioInfo } }
  | { type: 'usuario/update-dolares', payload: { info: UsuarioInfo } }
  | { type: 'usuario/get-auto', payload: { info: UsuarioInfo } }
  | { type: 'usuario/update-auto', payload: { info: UsuarioInfo } }
  | { type: 'usuario/get-casa', payload: { info: UsuarioInfo } }
  | { type: 'usuario/update-casa', payload: { info: UsuarioInfo } };

export const usuarioInitialState: UsuarioState = {
  info: []
};

// Helper function to update or add info item
const updateOrAddInfo = (state: UsuarioState, campo: string, newInfo: UsuarioInfo): UsuarioState => {
  const previousInfo = state.info.find(item => item.Campo === campo);
  if (previousInfo) {
    return {
      ...state,
      info: state.info.map(item =>
        item.Campo === campo
          ? { ...item, Valor: newInfo.Valor, id: newInfo.id }
          : item
      )
    };
  }
  return { ...state, info: [...state.info, newInfo] };
};

// Helper function to update existing info item
const updateInfo = (state: UsuarioState, campo: string, newInfo: UsuarioInfo): UsuarioState => {
  return {
    ...state,
    info: state.info.map(item => (item.Campo === campo ? newInfo : item))
  };
};

export const usuarioReducer = (state: UsuarioState, action: UsuarioActions): UsuarioState => {
  switch (action.type) {
    case 'usuario/get-deuda':
      return updateOrAddInfo(state, 'deuda', action.payload.info);
    case 'usuario/get-reserva':
      return updateOrAddInfo(state, 'reserva', action.payload.info);
    case 'usuario/get-sueldo':
      return updateOrAddInfo(state, 'sueldo', action.payload.info);
    case 'usuario/get-dolares':
      return updateOrAddInfo(state, 'dolares', action.payload.info);
    case 'usuario/get-efectivo':
      return updateOrAddInfo(state, 'efectivo', action.payload.info);
    case 'usuario/get-auto':
      return updateOrAddInfo(state, 'auto', action.payload.info);
    case 'usuario/get-casa':
      return updateOrAddInfo(state, 'casa', action.payload.info);
    case 'usuario/update-deuda':
      return updateInfo(state, 'deuda', action.payload.info);
    case 'usuario/update-reserva':
      return updateInfo(state, 'reserva', action.payload.info);
    case 'usuario/update-sueldo':
      return updateInfo(state, 'sueldo', action.payload.info);
    case 'usuario/update-dolares':
      return updateInfo(state, 'dolares', action.payload.info);
    case 'usuario/update-efectivo':
      return updateInfo(state, 'efectivo', action.payload.info);
    case 'usuario/update-auto':
      return updateInfo(state, 'auto', action.payload.info);
    case 'usuario/update-casa':
      return updateInfo(state, 'casa', action.payload.info);
    default:
      return state;
  }
};

