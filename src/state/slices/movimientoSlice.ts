import { TipoGasto, TipoMovimiento } from "../../types";
import { Movimiento } from "../../pages/Movimientos/types";

// ==================== MOVIMIENTOS SLICE ====================
export interface MovimientosState {
  movimientos: Movimiento[];
  editingId: string;
  tipos: TipoGasto[];
  codigos: TipoMovimiento[];
}

export type MovimientosActions =
  | { type: 'movimientos/get', payload: Movimiento[] }
  | { type: 'movimientos/get-all' }
  | { type: 'movimientos/get-tipos', payload: TipoGasto[] }
  | { type: 'movimientos/add', payload: { movimiento: Movimiento } }
  | { type: 'movimientos/read', payload: { id: Movimiento['id'] } }
  | { type: 'movimientos/update', payload: { movimiento: Movimiento } }
  | { type: 'movimientos/remove', payload: { id: Movimiento['id'] } };

export const movimientosInitialState: MovimientosState = {
  movimientos: [],
  editingId: '',
  tipos: [],
  codigos: []
};

export const movimientosReducer = (state: MovimientosState, action: MovimientosActions): MovimientosState => {
  switch (action.type) {
    case 'movimientos/get':
      return { ...state, movimientos: action.payload };
    case 'movimientos/get-all':
      return { ...state };
    case 'movimientos/get-tipos':
      return { ...state, tipos: action.payload };
    case 'movimientos/add':
      return { ...state, movimientos: [...state.movimientos, action.payload.movimiento] };
    case 'movimientos/read':
      return { ...state, editingId: action.payload.id };
    case 'movimientos/update':
      return { ...state, movimientos: state.movimientos.map(movimiento => movimiento.id === action.payload.movimiento.id ? action.payload.movimiento : movimiento) };
    case 'movimientos/remove':
      return { ...state, movimientos: state.movimientos.filter(movimiento => movimiento.id !== action.payload.id) };
    default:
      return state;
  }
};

