import type { TravelDetails } from "../../pages/Objetivos/Viajes/types";

export interface ViajesState {
  travels: TravelDetails[];
}

export type ViajesActions =
  | { type: "viajes/get"; payload: TravelDetails[] }
  | { type: "viajes/add"; payload: TravelDetails };

export const viajesInitialState: ViajesState = {
  travels: [],
};

export const viajesReducer = (
  state: ViajesState,
  action: ViajesActions
): ViajesState => {
  switch (action.type) {
    case "viajes/get":
      return { ...state, travels: action.payload };
    case "viajes/add":
      return { ...state, travels: [...state.travels, action.payload] };
    default:
      return state;
  }
};
