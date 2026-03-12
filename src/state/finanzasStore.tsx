import axios from "axios";
import { DateTime } from "luxon";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";

import { type Banco, type PlazosFijo } from "@/types/bancos";
import { type Impuesto } from "@/types/impuestos";
import { type Wallet } from "@/types/wallets";
import { type Movimiento } from "@/types/movimientos";
import { type Cripto, type Inversion, type UsuarioInfo } from "@/types";
/* import { AppAlert } from "../components/AppAlert";
 */import { getApiUrl, normalizarVencimiento, resolveMetodoLabel, sortImpuestosByVencimiento } from "../utils/utils";

// Import slices
import {
  type BancosActions,
  bancosInitialState,
  bancosReducer,
  type BancosState
} from "./slices/bancosSlice";

import {
  type WalletsActions,
  walletsInitialState,
  walletsReducer,
  type WalletsState
} from "./slices/walletsSlice";

import {
  type ImpuestosActions,
  impuestosInitialState,
  impuestosReducer,
  type ImpuestosState
} from "./slices/impuestosSlice";

import {
  type MovimientosActions,
  movimientosInitialState,
  movimientosReducer,
  type MovimientosState
} from "./slices/movimientoSlice";

import {
  type PlazosFijosActions,
  plazosFijosInitialState,
  plazosFijosReducer,
  type PlazosFijosState
} from "./slices/plazosFijosSlice";

import {
  type UsuarioActions,
  usuarioInitialState,
  usuarioReducer,
  type UsuarioState
} from "./slices/usuarioSlice";

import {
  type InversionesActions,
  inversionesInitialState,
  inversionesReducer,
  type InversionesState
} from "./slices/inversionesSlice";

import {
  type CriptosActions,
  criptosInitialState,
  criptosReducer,
  type CriptosState
} from "./slices/criptosSlice";

import {
  type ViajesActions,
  viajesInitialState,
  viajesReducer,
  type ViajesState
} from "./slices/viajesSlice";

import type { TravelDetails } from "../types/viajes";

// Mock: devuelve la lista de viajes para getViajes (sin API aún)
import travelDetailsMock from "../utils/travelDetails.json";

// ==================== COTIZACIONES (dentro del store, sin slice) ====================
export type CotizacionCasa = {
  casa?: string;
  nombre?: string;
  compra?: number;
  venta?: number;
  [key: string]: unknown;
};

export type CotizacionesState = {
  oficial: CotizacionCasa | null;
  blue: CotizacionCasa | null;
};

type CotizacionesSetAction = { type: 'cotizaciones/set'; payload: CotizacionesState };

// ==================== COMBINED STATE & ACTIONS ====================
interface CombinedState {
  impuestos: ImpuestosState;
  movimientos: MovimientosState;
  wallets: WalletsState;
  bancos: BancosState;
  plazosFijos: PlazosFijosState;
  usuario: UsuarioState;
  inversiones: InversionesState;
  criptos: CriptosState;
  viajes: ViajesState;
  cotizaciones: CotizacionesState;
  resumenMensual: any;
}

type CombinedActions = ImpuestosActions | MovimientosActions | WalletsActions | BancosActions | PlazosFijosActions | UsuarioActions | InversionesActions | CriptosActions | ViajesActions | CotizacionesSetAction;

const cotizacionesInitialState: CotizacionesState = { oficial: null, blue: null };

const combinedInitialState: CombinedState = {
  impuestos: impuestosInitialState,
  movimientos: movimientosInitialState,
  wallets: walletsInitialState,
  bancos: bancosInitialState,
  plazosFijos: plazosFijosInitialState,
  usuario: usuarioInitialState,
  inversiones: inversionesInitialState,
  criptos: criptosInitialState,
  viajes: viajesInitialState,
  cotizaciones: cotizacionesInitialState,
  resumenMensual: null,
};

const combinedReducer = (state: CombinedState, action: CombinedActions): CombinedState => {
  if (action.type === 'cotizaciones/set') {
    return { ...state, cotizaciones: action.payload };
  }
  return {
    ...state,
    impuestos: impuestosReducer(state.impuestos, action as ImpuestosActions),
    movimientos: movimientosReducer(state.movimientos, action as MovimientosActions),
    wallets: walletsReducer(state.wallets, action as WalletsActions),
    bancos: bancosReducer(state.bancos, action as BancosActions),
    plazosFijos: plazosFijosReducer(state.plazosFijos, action as PlazosFijosActions),
    usuario: usuarioReducer(state.usuario, action as UsuarioActions),
    inversiones: inversionesReducer(state.inversiones, action as InversionesActions),
    criptos: criptosReducer(state.criptos, action as CriptosActions),
    viajes: viajesReducer(state.viajes, action as ViajesActions),
  };
};

// ==================== CONTEXT TYPES ====================
type BancosContextProps = {
  state: BancosState;
  get: () => Promise<void>;
  add: (banco: Banco) => Promise<void>;
  read: (id: Banco['id']) => Promise<void>;
  update: (banco: Banco) => Promise<void>;
  remove: (id: Banco['id']) => Promise<void>;
};

type ImpuestosContextProps = {
  state: ImpuestosState;
  get: () => Promise<void>;
  add: (impuesto: Impuesto) => Promise<void>;
  read: (id: Impuesto['id']) => Promise<void>;
  update: (impuesto: Impuesto) => Promise<void>;
  remove: (id: Impuesto['id']) => Promise<void>;
};

type MovimientosContextProps = {
  state: MovimientosState;
  get: () => Promise<void>;
  getAll: () => Promise<Movimiento[]>;
  add: (movimiento: Movimiento) => Promise<void>;
  read: (id: Movimiento['id']) => Promise<void>;
  update: (movimiento: Movimiento) => Promise<void>;
  remove: (id: Movimiento['id']) => Promise<void>;
};

type WalletsContextProps = {
  state: WalletsState;
  get: () => Promise<void>;
  add: (wallet: Wallet) => Promise<void>;
  read: (id: Wallet['id']) => Promise<void>;
  update: (wallet: Wallet) => Promise<void>;
  remove: (id: Wallet['id']) => Promise<void>;
  updateReserva: (reserva: any) => Promise<void>;
  getReserva: () => Promise<void>;
}

type PlazosFijosContextProps = {
  state: PlazosFijosState;
  get: () => Promise<void>;
  getByBanco: (bancoId: Banco['id']) => Promise<void>;
  add: (plazo: PlazosFijo) => Promise<void>;
  read: (id: PlazosFijo['id']) => Promise<void>;
  update: (plazo: PlazosFijo) => Promise<void>;
  remove: (id: PlazosFijo['id']) => Promise<void>;
}

type UsuarioContextProps = {
  state: UsuarioState;
  get: () => Promise<void>;
  update: (info: UsuarioInfo[]) => Promise<void>;
}

type InversionesContextProps = {
  state: InversionesState;
  get: () => Promise<void>;
  add: (inversion: Inversion) => Promise<void>;
  read: (id: Inversion['id']) => Promise<void>;
  update: (inversion: Inversion) => Promise<void>;
  remove: (id: Inversion['id']) => Promise<void>;
}

type CriptosContextProps = {
  state: CriptosState;
  get: () => Promise<void>;
  add: (cripto: Cripto) => Promise<void>;
  read: (id: Cripto['id']) => Promise<void>;
  update: (cripto: Cripto) => Promise<void>;
  remove: (id: Cripto['id']) => Promise<void>;
}

type ViajesContextProps = {
  state: ViajesState;
  get: () => Promise<TravelDetails[]>;
  add: (travel: TravelDetails) => void;
};

type FinanzasContextProps = {
  state: CombinedState;
  impuestos: ImpuestosContextProps;
  movimientos: MovimientosContextProps;
  wallets: WalletsContextProps;
  bancos: BancosContextProps;
  plazosFijos: PlazosFijosContextProps;
  usuario: UsuarioContextProps;
  inversiones: InversionesContextProps;
  criptos: CriptosContextProps;
  viajes: ViajesContextProps;
  cotizaciones: CotizacionesState;
  getCotizaciones: () => Promise<void>;
};

export const FinanzasGlobalContext = createContext({} as FinanzasContextProps);

// ==================== PROVIDER ====================
const ALERT_THROTTLE_MS = 3000;

export const FinanzasGlobalProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(combinedReducer, combinedInitialState);
  const [alertState, setAlertState] = useState<{ title: string; message: string } | null>(null);
  const showAlertRef = useRef<(title: string, message: string) => void>(() => { });
  const lastAlertAtRef = useRef(0);

  showAlertRef.current = (title: string, message: string) => setAlertState({ title, message });

  const api = getApiUrl();
  axios.defaults.timeout = 10000;

  const API_MOVIMIENTOS = `${api}movimientos`;
  const API_IMPUESTOS = `${api}fijos`;
  const API_WALLETS = `${api}wallets`;
  const API_BANCOS = `${api}bancos`;
  const API_PLACOS_FIJOS = `${api}plazosfijos`;
  const API_USUARIO = `${api}datosUsuario`;
  const API_INVERSIONES = `${api}inversiones`;
  const API_CRIPTOS = `${api}criptos`;

  useEffect(() => {
    const onRejected = (error: any) => {
      const isNetwork = !error.response;
      const status = error.response?.status;
      const message = error.response?.data?.message ?? error.response?.data?.error ?? error.message;
      let userMessage: string;
      if (error.code === 'ERR_SSL_PROTOCOL_ERROR' || error.message?.includes('SSL')) {
        console.error('SSL Error detected. Possible causes:');
        console.error('1. Page is HTTPS but API is HTTP (mixed content)');
        console.error('2. API URL:', api);
        console.error('3. Current page protocol:', globalThis.window?.location?.protocol ?? 'N/A');
        userMessage = 'Error de conexión segura con el servidor. Revisá que la URL del backend sea correcta (HTTP/HTTPS).';
      } else if (isNetwork || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        userMessage = 'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.';
      } else if (status === 401) {
        userMessage = 'Sesión expirada o no autorizado. Volvé a iniciar sesión.';
      } else if (status && status >= 500) {
        userMessage = 'Error del servidor. Intentá más tarde.';
      } else {
        userMessage = typeof message === 'string' && message ? message : 'Error al sincronizar con el servidor. Intentá de nuevo.';
      }
      const now = Date.now();
      if (now - lastAlertAtRef.current >= ALERT_THROTTLE_MS) {
        lastAlertAtRef.current = now;
        //if (Platform.OS === 'web') {
        showAlertRef.current('Error de sincronización', userMessage);
        /*         } else {
                  Alert.alert('Error de sincronización', userMessage, [{ text: 'OK' }]);
                } */
      }
      return Promise.reject(error);
    };

    const id = axios.interceptors.response.use((response) => response, onRejected);
    return () => {
      axios.interceptors.response.eject(id);
    };
  }, [api]);

  // ==================== BANCOS ACTIONS ====================
  const getBancos = useCallback(async () => {
    const result = await axios.get(`${API_BANCOS}`);
    const values = result.data;
    const bancos: Banco[] = values.map((banco: any) => {
      const resultBanco: Banco = {
        id: banco._id,
        Nombre: banco.Nombre,
        Efectivo: banco.Efectivo,
        CBU: banco.CBU,
        Alias: banco.Alias,
        Logo: banco.Logo,
        EsMetodo: banco.EsMetodo,
        PlazosFijos: banco.plazosfijos ?? [],
      }
      return resultBanco;
    });
    dispatch({ type: 'bancos/get', payload: bancos });
  }, [api]);

  const addBanco = useCallback(async (banco: Banco) => {
    const result = await axios.post(`${API_BANCOS}`, banco);
    const newBanco: Banco = {
      id: result.data.id,
      Nombre: result.data.Nombre,
      Efectivo: result.data.Efectivo,
      CBU: result.data.CBU,
      Alias: result.data.Alias,
      Logo: result.data.Logo,
      EsMetodo: result.data.EsMetodo,
      PlazosFijos: result.data.plazosfijos ?? [],
    }
    dispatch({ type: 'bancos/add', payload: { banco: newBanco } });
  }, [api]);

  const readBanco = useCallback(async (id: Banco['id']) => {
    dispatch({ type: 'bancos/read', payload: { id } });
  }, []);

  const updateBanco = useCallback(async (banco: Banco) => {
    const result = await axios.put(`${API_BANCOS}/${banco.id}`, banco);
    console.log('Update banco response:', result.data);
    const updatedBanco: Banco = {
      id: result.data._id || result.data.id || banco.id,
      Nombre: result.data.Nombre,
      Efectivo: result.data.Efectivo,
      CBU: result.data.CBU,
      Alias: result.data.Alias,
      Logo: result.data.Logo,
      EsMetodo: result.data.EsMetodo,
      PlazosFijos: result.data.plazosfijos ?? [],
    }
    console.log('Updated banco object:', updatedBanco);
    dispatch({ type: 'bancos/update', payload: { banco: updatedBanco } });
  }, [api]);

  const deleteBanco = useCallback(async (id: Banco['id']) => {
    const result = await axios.delete(`${API_BANCOS}/${id}`);
    console.log(result.data);
    dispatch({ type: 'bancos/remove', payload: { id } });
  }, [api]);

  // ==================== IMPUESTOS ACTIONS ====================
  const formatFecha = useCallback((fecha: string): string => normalizarVencimiento(fecha) || fecha || '', []);

  const getImpuestos = useCallback(async () => {
    const result = await axios.get(`${API_IMPUESTOS}`);
    const raw = result.data;
    const values = Array.isArray(raw) ? raw : (raw?.fijos ?? []);

    const impuestos: Impuesto[] = sortImpuestosByVencimiento(values.map((tax: any) => ({
      id: tax._id,
      Vencimiento: normalizarVencimiento(tax.Vencimiento ?? '') || (tax.Vencimiento ?? ''),
      Datos: tax.Datos,
      URL: tax.URL,
      Detalle: tax.Detalle,
      Deuda: tax.Deuda,
      Logo: tax.Logo,
    })));
    dispatch({ type: 'impuestos/get', payload: impuestos });
  }, [api]);

  const addImpuesto = useCallback(async (impuesto: Impuesto) => {
    const result = await axios.post(`${API_IMPUESTOS}`, impuesto);
    const newImpuesto: Impuesto = {
      id: result.data.__id,
      Vencimiento: normalizarVencimiento(result.data.Vencimiento ?? '') || (result.data.Vencimiento ?? ''),
      Datos: result.data.Datos,
      URL: result.data.URL,
      Detalle: result.data.Detalle,
      Deuda: result.data.Deuda,
      Logo: result.data.Logo,
    }
    dispatch({ type: 'impuestos/add', payload: { impuesto: newImpuesto } });
  }, [api]);

  const readImpuesto = useCallback(async (id: Impuesto['id']) => {
    dispatch({ type: 'impuestos/read', payload: { id } });
  }, []);

  const updateImpuesto = useCallback(async (impuesto: Impuesto) => {
    const result = await axios.put(`${API_IMPUESTOS}/${impuesto.id}`, impuesto);
    console.log(result.data);
    dispatch({ type: 'impuestos/update', payload: { impuesto } });
  }, [api]);

  const deleteImpuesto = useCallback(async (id: Impuesto['id']) => {
    const result = await axios.delete(`${API_IMPUESTOS}/${id}`);
    console.log(result.data);
    dispatch({ type: 'impuestos/remove', payload: { id } });
  }, [api]);

  const getMovimientos = useCallback(async () => {
    const result = await axios.get(API_MOVIMIENTOS);
    const values = result.data;

    const movimientos = values.map((movimiento: any) => {
      const resultMovimiento: Movimiento = {
        id: movimiento._id,
        Concepto: movimiento.Concepto,
        Monto: movimiento.Monto,
        Fecha: formatFecha(movimiento.Fecha),
        Donde: movimiento.Donde,
        Tipo: movimiento.Tipo,
        Metodo: movimiento.Metodo || '',
        Codigo: movimiento.Codigo,
      } as Movimiento;
      return resultMovimiento;
    }).sort((a: Movimiento, b: Movimiento) => DateTime.fromFormat(b.Fecha, 'yyyy-MM-dd').toMillis() - DateTime.fromFormat(a.Fecha, 'yyyy-MM-dd').toMillis());
    dispatch({ type: 'movimientos/get', payload: movimientos });
  }, [api]);

  // ==================== GASTOS ACTIONS ====================

  const getAllMovimientos = useCallback(async () => {
    const result = await axios.get(`${API_MOVIMIENTOS}?all=true`);
    const values = result.data;

    const movimientos = values.map((movimiento: any) => {
      const resultMovimiento: Movimiento = {
        id: movimiento._id,
        Concepto: movimiento.Concepto,
        Monto: movimiento.Monto,
        Fecha: formatFecha(movimiento.Fecha),
        Donde: movimiento.Donde,
        Tipo: movimiento.Tipo,
        Metodo: movimiento.Metodo || '',
        Codigo: movimiento.Codigo,
      }
      return resultMovimiento;
    });
    dispatch({ type: 'movimientos/get', payload: movimientos });
    return movimientos;
  }, [api, formatFecha]);

  const addMovimiento = useCallback(async (movimiento: Movimiento) => {
    const result = await axios.post(`${API_MOVIMIENTOS}`, movimiento);
    const newMovimiento: Movimiento = {
      id: result.data.id,
      Concepto: result.data.Concepto,
      Monto: result.data.Monto,
      Fecha: formatFecha(result.data.Fecha ?? '') || (result.data.Fecha ?? ''),
      Donde: result.data.Donde ?? '',
      Tipo: result.data.Tipo,
      Metodo: result.data.Metodo ?? '',
      Codigo: result.data.Codigo,
    } as Movimiento;
    dispatch({ type: 'movimientos/add', payload: { movimiento: newMovimiento } });
  }, [api, formatFecha]);

  const readMovimiento = useCallback(async (id: Movimiento['id']) => {
    dispatch({ type: 'movimientos/read', payload: { id } });
  }, []);

  const updateMovimiento = useCallback(async (movimiento: Movimiento) => {
    console.log('updateMovimiento', movimiento);
    await axios.put(`${API_MOVIMIENTOS}/${movimiento.id}`, movimiento);
    const fechaNorm = formatFecha(movimiento.Fecha ?? '') || (movimiento.Fecha ?? '');
    const updated: Movimiento = { ...movimiento, Fecha: fechaNorm };
    dispatch({ type: 'movimientos/update', payload: { movimiento: updated } });
  }, [api, formatFecha]);

  const deleteMovimiento = useCallback(async (id: Movimiento['id']) => {
    const result = await axios.delete(`${API_MOVIMIENTOS}/${id}`);
    console.log(result.data);
    dispatch({ type: 'movimientos/remove', payload: { id } });
  }, [api]);

  // ==================== WALLETS ACTIONS ====================

  const getWallets = useCallback(async () => {
    const result = await axios.get(`${API_WALLETS}`);
    const values = result.data;
    const wallets: Wallet[] = values.map((wallet: any) => {
      const resultWallet: Wallet = {
        id: wallet._id,
        Nombre: wallet.Nombre,
        Inicio: wallet.Inicio,
        Interes: wallet.Interes,
        Efectivo: wallet.Efectivo,
        Logo: wallet.Logo,
        CVU: wallet.CVU,
        Alias: wallet.Alias,
        EsMetodo: !!wallet.EsMetodo,
      }
      return resultWallet;
    }).sort((a: Wallet, b: Wallet) => b.Efectivo - a.Efectivo);
    dispatch({ type: 'wallets/get', payload: wallets });
  }, [api]);

  const addWallet = useCallback(async (wallet: Wallet) => {
    const result = await axios.post(`${API_WALLETS}`, wallet);
    const newWallet: Wallet = {
      id: result.data.id,
      Nombre: result.data.Nombre,
      Inicio: result.data.Inicio,
      Interes: result.data.Interes,
      Efectivo: result.data.Efectivo,
      Logo: result.data.Logo,
      CVU: result.data.CVU,
      Alias: result.data.Alias,
      EsMetodo: result.data.EsMetodo,
    }
    dispatch({ type: 'wallets/add', payload: { wallet: newWallet } });
  }, [api]);

  const readWallet = useCallback(async (id: Wallet['id']) => {
    dispatch({ type: 'wallets/read', payload: { id } });
  }, []);

  const updateWallet = useCallback(async (wallet: Wallet) => {
    const result = await axios.put(`${API_WALLETS}/${wallet.id}`, wallet);
    console.log(result.data);
    dispatch({ type: 'wallets/update', payload: { wallet } });
  }, [api]);

  const deleteWallet = useCallback(async (id: Wallet['id']) => {
    const result = await axios.delete(`${API_WALLETS}/${id}`);
    console.log(result.data);
    dispatch({ type: 'wallets/remove', payload: { id } });
  }, [api]);

  const updateReserva = useCallback(async (reserva: any) => {
    const data = {
      Campo: reserva.Campo,
      Valor: reserva.Valor,
    }
    let result: any = null;
    if (reserva.id) {
      result = await axios.put(`${API_USUARIO}/${reserva.id}`, data);
    } else {
      result = await axios.post(`${API_USUARIO}`, data);
    }
    console.log(result?.data);
    dispatch({ type: 'wallets/update-reserva', payload: { reserva } });
    dispatch({ type: 'usuario/update-reserva', payload: { info: reserva } });
  }, [api]);

  const getReserva = useCallback(async () => {
    const result = await axios.get(`${API_USUARIO}?Campo=reserva`);
    const value = {
      id: result.data[0]._id,
      Campo: result.data[0].Campo,
      Valor: result.data[0].Valor,
    }
    dispatch({ type: 'wallets/get-reserva', payload: value ?? {} as any });
    dispatch({ type: 'usuario/get-reserva', payload: { info: value ?? {} as any } });
  }, [api]);

  // ==================== PLAZOS FIJOS ACTIONS ====================

  const getPlazosFijos = useCallback(async () => {
    const result = await axios.get(`${API_PLACOS_FIJOS}`);
    const values = result.data;
    const plazosFijos: PlazosFijo[] = values.map((plazo: any) => {
      console.log('plazo', plazo);
      const resultPlazosFijo: PlazosFijo = {
        id: plazo._id,
        Nombre: plazo.Nombre,
        Periodo: plazo.Periodo,
        Vencimiento: plazo.Vencimiento,
        Capital: plazo.Capital,
        TNA: plazo.TNA,
        Banco: plazo.Banco ?? '',
      }
      return resultPlazosFijo;
    });
    dispatch({ type: 'plazos-fijos/get', payload: plazosFijos });
  }, [api]);


  const getPlazosFijosByBanco = useCallback(async (bancoId: Banco['id']) => {
    const result = await axios.get(`${API_BANCOS}/${bancoId}/plazosfijos`);
    const values = result.data;
    const plazosFijos: PlazosFijo[] = values.map((plazo: any) => {
      const resultPlazosFijo: PlazosFijo = {
        id: plazo._id,
        Nombre: plazo.Nombre,
        Periodo: plazo.Periodo,
        Vencimiento: plazo.Vencimiento,
        Capital: plazo.Capital,
        TNA: plazo.TNA,
        Banco: plazo.Banco,
      }
      return resultPlazosFijo;
    });
    dispatch({ type: 'plazos-fijos/get', payload: plazosFijos });
  }, []);

  const addPlazosFijo = useCallback(async (plazo: PlazosFijo) => {
    const result = await axios.post(`${API_PLACOS_FIJOS}`, plazo);
    const newPlazosFijo: PlazosFijo = {
      id: result.data.id,
      Nombre: result.data.Nombre,
      Periodo: result.data.Periodo,
      Vencimiento: result.data.Vencimiento,
      Capital: result.data.Capital,
      TNA: result.data.TNA,
      Banco: result.data.Banco,
    }
    dispatch({ type: 'plazos-fijos/add', payload: { plazo: newPlazosFijo } });
  }, [api]);

  const readPlazosFijo = useCallback(async (id: PlazosFijo['id']) => {
    dispatch({ type: 'plazos-fijos/read', payload: { id } });
  }, []);

  const updatePlazosFijo = useCallback(async (plazo: PlazosFijo) => {
    const result = await axios.put(`${API_PLACOS_FIJOS}/${plazo.id}`, plazo);
    console.log(result.data);
    dispatch({ type: 'plazos-fijos/update', payload: { plazo } });
  }, [api]);

  const deletePlazosFijo = useCallback(async (id: PlazosFijo['id']) => {
    const result = await axios.delete(`${API_PLACOS_FIJOS}/${id}`);
    console.log(result.data);
    dispatch({ type: 'plazos-fijos/remove', payload: { id } });
  }, [api]);

  // ==================== PRINCIPAL ACTIONS ====================
  const getUsuario = useCallback(async () => {
    const [resultDeuda, resultReserva, resultSueldo, resultEfectivo, resultDolares, resultAuto, resultCasa] = await Promise.all([
      axios.get(`${API_USUARIO}?Campo=deuda`),
      axios.get(`${API_USUARIO}?Campo=reserva`),
      axios.get(`${API_USUARIO}?Campo=sueldo`),
      axios.get(`${API_USUARIO}?Campo=efectivo`),
      axios.get(`${API_USUARIO}?Campo=dolares`),
      axios.get(`${API_USUARIO}?Campo=auto`),
      axios.get(`${API_USUARIO}?Campo=casa`),
    ]);
    let valueDeuda = { Campo: 'deuda', Valor: 0, id: '' } as any;
    if (resultDeuda.data.length > 0) {
      valueDeuda = {
        id: resultDeuda.data[0]._id,
        Campo: resultDeuda.data[0].Campo,
        Valor: resultDeuda.data[0].Valor,
      }
    }
    dispatch({ type: 'usuario/get-deuda', payload: { info: valueDeuda } });
    let valueReserva = { Campo: 'reserva', Valor: 0, id: '' } as any;
    if (resultReserva.data.length > 0) {
      valueReserva = {
        id: resultReserva.data[0]._id,
        Campo: resultReserva.data[0].Campo,
        Valor: resultReserva.data[0].Valor,
      }
    }
    dispatch({ type: 'usuario/get-reserva', payload: { info: valueReserva } });
    dispatch({ type: 'wallets/update-reserva', payload: { reserva: valueReserva } });
    let valueSueldo = { Campo: 'sueldo', Valor: 0, id: '' } as any;
    if (resultSueldo.data.length > 0) {
      valueSueldo = {
        id: resultSueldo.data[0]._id,
        Campo: resultSueldo.data[0].Campo,
        Valor: resultSueldo.data[0].Valor,
      }
    }
    dispatch({ type: 'usuario/get-sueldo', payload: { info: valueSueldo } });
    let valueEfectivo = { Campo: 'efectivo', Valor: 0, id: '' } as any;
    if (resultEfectivo.data.length > 0) {
      valueEfectivo = {
        id: resultEfectivo.data[0]._id,
        Campo: resultEfectivo.data[0].Campo,
        Valor: resultEfectivo.data[0].Valor,
      }
    }
    dispatch({ type: 'usuario/get-efectivo', payload: { info: valueEfectivo } });
    let valueDolares = { Campo: 'dolares', Valor: 0, id: '' } as any;
    if (resultDolares.data.length > 0) {
      valueDolares = {
        id: resultDolares.data[0]._id,
        Campo: resultDolares.data[0].Campo,
        Valor: resultDolares.data[0].Valor,
      }
    }
    dispatch({ type: 'usuario/get-dolares', payload: { info: valueDolares } });
    let valueAuto = { Campo: 'auto', Valor: 0, id: '' } as any;
    if (resultAuto.data.length > 0) {
      valueAuto = {
        id: resultAuto.data[0]._id,
        Campo: resultAuto.data[0].Campo,
        Valor: resultAuto.data[0].Valor,
      }
    }
    dispatch({ type: 'usuario/get-auto', payload: { info: valueAuto } });
    let valueCasa = { Campo: 'casa', Valor: 0, id: '' } as any;
    if (resultCasa.data.length > 0) {
      valueCasa = {
        id: resultCasa.data[0]._id,
        Campo: resultCasa.data[0].Campo,
        Valor: resultCasa.data[0].Valor,
      }
    }
    dispatch({ type: 'usuario/get-casa', payload: { info: valueCasa } });
  }, [api]);

  const updateUsuario = useCallback(async (info: UsuarioInfo[]) => {
    for (const ui of info) {
      if (ui.id) {
        await axios.put(`${API_USUARIO}/${ui.id}`, ui);
      } else {
        await axios.post(`${API_USUARIO}`, ui);
      }
      const action = `usuario/update-${ui.Campo.toLowerCase()}` as 'usuario/update-deuda' | 'usuario/update-reserva' | 'usuario/update-sueldo' | 'usuario/update-efectivo' | 'usuario/update-dolares' | 'usuario/update-auto' | 'usuario/update-casa';
      dispatch({ type: action, payload: { info: ui } });
    }
  }, [api]);
  // ==================== INVERSIONES ACTIONS ====================
  const getInversiones = useCallback(async () => {
    const result = await axios.get(`${API_INVERSIONES}`);
    const values = result.data;
    const inversiones: Inversion[] = values.map((inversion: any) => {
      const resultInversion: Inversion = {
        id: inversion.id,
        Nombre: inversion.Nombre,
        Capital: inversion.Capital,

        Moneda: inversion.Moneda,
      }
      return resultInversion;
    });
    dispatch({ type: 'inversiones/get', payload: inversiones });
  }, [api]);

  const addInversion = useCallback(async (inversion: Inversion) => {
    const result = await axios.post(`${API_INVERSIONES}`, inversion);
    const newInversion: Inversion = {
      id: result.data.id,
      Nombre: result.data.Nombre,
      Capital: result.data.Capital,
      Moneda: result.data.Moneda,
    }
    dispatch({ type: 'inversiones/add', payload: { inversion: newInversion } });
  }, [api]);

  const readInversion = useCallback(async (id: Inversion['id']) => {
    dispatch({ type: 'inversiones/read', payload: { id } });
  }, []);

  const updateInversion = useCallback(async (inversion: Inversion) => {
    const result = await axios.put(`${API_INVERSIONES}/${inversion.id}`, inversion);
    console.log(result.data);
    dispatch({ type: 'inversiones/update', payload: { inversion } });
  }, [api]);

  const deleteInversion = useCallback(async (id: Inversion['id']) => {
    const result = await axios.delete(`${API_INVERSIONES}/${id}`);
    console.log(result.data);
    dispatch({ type: 'inversiones/remove', payload: { id } });
  }, [api]);

  // ==================== CRIPTOS ACTIONS ====================

  const getCriptos = useCallback(async () => {
    const result = await axios.get(`${API_CRIPTOS}`);
    const values = result.data;
    const criptos: Cripto[] = values.map((cripto: any) => {
      const resultCripto: Cripto = {
        id: cripto.id,
        Nombre: cripto.Nombre,
        Cantidad: cripto.Cantidad,
        Logo: cripto.Logo,
        Sigla: cripto.Sigla,
        Hoy: cripto.Hoy,
      }
      return resultCripto;
    });
    dispatch({ type: 'criptos/get', payload: criptos });
  }, [api]);

  const addCripto = useCallback(async (cripto: Cripto) => {
    const result = await axios.post(`${API_CRIPTOS}`, cripto);
    const newCripto: Cripto = {
      id: result.data.id,
      Nombre: result.data.Nombre,
      Cantidad: result.data.Cantidad,
      Logo: result.data.Logo,
      Sigla: result.data.Sigla,
      Hoy: result.data.Hoy,
    }
    dispatch({ type: 'criptos/add', payload: { cripto: newCripto } });
  }, [api]);

  const readCripto = useCallback(async (id: Cripto['id']) => {
    dispatch({ type: 'criptos/read', payload: { id } });
  }, []);

  const updateCripto = useCallback(async (cripto: Cripto) => {
    const result = await axios.put(`${API_CRIPTOS}/${cripto.id}`, cripto);
    console.log(result.data);
    dispatch({ type: 'criptos/update', payload: { cripto } });
  }, [api]);

  const deleteCripto = useCallback(async (id: Cripto['id']) => {
    const result = await axios.delete(`${API_CRIPTOS}/${id}`);
    console.log(result.data);
    dispatch({ type: 'criptos/remove', payload: { id } });
  }, [api]);

  const getCotizaciones = useCallback(async () => {
    const result = await axios.get(`https://dolarapi.com/v1/dolares`);
    const lista: CotizacionCasa[] = result.data ?? [];
    const oficial = lista.find((c: CotizacionCasa) => c.casa === 'oficial') ?? null;
    const blue = lista.find((c: CotizacionCasa) => c.casa === 'blue') ?? null;
    dispatch({ type: 'cotizaciones/set', payload: { oficial, blue } });
  }, []);

  // ==================== VIAJES ACTIONS (mock) ====================
  const getViajes = useCallback(async (): Promise<TravelDetails[]> => {
    const list = travelDetailsMock as TravelDetails[];
    dispatch({ type: 'viajes/get', payload: list });
    return list;
  }, []);

  const addTravel = useCallback((travel: TravelDetails) => {
    dispatch({ type: 'viajes/add', payload: travel });
  }, []);

  // ==================== MEMOIZED VALUES ====================

  const bancosValue = useMemo(() => ({
    state: state.bancos,
    get: getBancos,
    add: addBanco,
    read: readBanco,
    update: updateBanco,
    remove: deleteBanco
  }), [state.bancos, getBancos, addBanco, readBanco, updateBanco, deleteBanco]);

  const impuestosValue = useMemo(() => ({
    state: state.impuestos,
    get: getImpuestos,
    add: addImpuesto,
    read: readImpuesto,
    update: updateImpuesto,
    remove: deleteImpuesto,
  }), [state.impuestos, getImpuestos, addImpuesto, readImpuesto, updateImpuesto, deleteImpuesto]);

  const movimientosValue = useMemo(() => ({
    state: state.movimientos,
    get: getMovimientos,
    getAll: getAllMovimientos,
    add: addMovimiento,
    read: readMovimiento,
    update: updateMovimiento,
    remove: deleteMovimiento
  }), [state.movimientos, getMovimientos, getAllMovimientos, addMovimiento, readMovimiento, updateMovimiento, deleteMovimiento]);

  const walletsValue = useMemo(() => ({
    state: state.wallets,
    get: getWallets,
    add: addWallet,
    read: readWallet,
    update: updateWallet,
    remove: deleteWallet,
    updateReserva: updateReserva,
    getReserva: getReserva
  }), [state.wallets, getWallets, addWallet, readWallet, updateWallet, deleteWallet]);

  const plazosFijosValue = useMemo(() => ({
    state: state.plazosFijos,
    get: getPlazosFijos,
    getByBanco: getPlazosFijosByBanco,
    add: addPlazosFijo,
    read: readPlazosFijo,
    update: updatePlazosFijo,
    remove: deletePlazosFijo
  }), [state.plazosFijos, getPlazosFijos, addPlazosFijo, readPlazosFijo, updatePlazosFijo, deletePlazosFijo]);

  const usuarioValue = useMemo(() => ({
    state: state.usuario,
    get: getUsuario,
    update: updateUsuario
  }), [state.usuario, getUsuario, updateUsuario]);

  const inversionesValue = useMemo(() => ({
    state: state.inversiones,
    get: getInversiones,
    add: addInversion,
    read: readInversion,
    update: updateInversion,
    remove: deleteInversion
  }), [state.inversiones, getInversiones, addInversion, readInversion, updateInversion, deleteInversion]);

  const criptosValue = useMemo(() => ({
    state: state.criptos,
    get: getCriptos,
    add: addCripto,
    read: readCripto,
    update: updateCripto,
    remove: deleteCripto
  }), [state.criptos, getCriptos, addCripto, readCripto, updateCripto, deleteCripto]);

  const viajesValue = useMemo(() => ({
    state: state.viajes,
    get: getViajes,
    add: addTravel,
  }), [state.viajes, getViajes, addTravel]);

  // ==================== COMBINED VALUE ====================
  const value = useMemo(() => ({
    state,
    impuestos: impuestosValue,
    movimientos: movimientosValue,
    wallets: walletsValue,
    bancos: bancosValue,
    plazosFijos: plazosFijosValue,
    usuario: usuarioValue,
    inversiones: inversionesValue,
    criptos: criptosValue,
    viajes: viajesValue,
    cotizaciones: state.cotizaciones,
    getCotizaciones
  }), [state, impuestosValue, movimientosValue, walletsValue, bancosValue, plazosFijosValue, usuarioValue, inversionesValue, criptosValue, viajesValue, state.cotizaciones, getCotizaciones]);

  return (
    <FinanzasGlobalContext.Provider value={value}>
      {children}
      {/* <AppAlert
        visible={alertState !== null}
        title={alertState?.title ?? ''}
        message={alertState?.message ?? ''}
        onClose={() => setAlertState(null)}
      /> */}
    </FinanzasGlobalContext.Provider>
  );
};

// ==================== CUSTOM HOOKS ====================
export const useBancos = () => {
  const context = useContext(FinanzasGlobalContext);
  return context.bancos;
};

export const useImpuestos = () => {
  const context = useContext(FinanzasGlobalContext);
  return context.impuestos;
};

export const useMovimientos = () => {
  const context = useContext(FinanzasGlobalContext);
  return context.movimientos;
};

export const useWallets = () => {
  const context = useContext(FinanzasGlobalContext);
  return context.wallets;
};

export const usePlazosFijos = () => {
  const context = useContext(FinanzasGlobalContext);
  return context.plazosFijos;
};

export const useUsuario = () => {
  const context = useContext(FinanzasGlobalContext);
  return context.usuario;
};

export const useInversiones = () => {
  const context = useContext(FinanzasGlobalContext);
  return context.inversiones;
};

export const useCriptos = () => {
  const context = useContext(FinanzasGlobalContext);
  return context.criptos;
};

export const useViajes = () => {
  const context = useContext(FinanzasGlobalContext);
  return context.viajes;
};

export const useFinanzas = () => {
  const context = useContext(FinanzasGlobalContext);
  return context;
};

/** Wallets y bancos marcados como método de pago (para selects en gastos, etc.). */
export function useMetodosDePago() {
  const { wallets, bancos } = useFinanzas();
  return [
    ...wallets.state.wallets.filter((wallet: Wallet) => wallet.EsMetodo),
    ...bancos.state.bancos.filter((banco: Banco) => banco.EsMetodo),
  ];
}

/** Devuelve una función que resuelve Metodo (id) a etiqueta (Wallet/Banco nombre o "Otros") sin pasar wallets/bancos. */
export function useResolveMetodoLabel(): (metodo: string | undefined) => string {
  const { wallets, bancos } = useFinanzas();
  return useCallback(
    (metodo: string | undefined) => resolveMetodoLabel(metodo, wallets.state.wallets, bancos.state.bancos),
    [wallets.state.wallets, bancos.state.bancos]
  );
}
