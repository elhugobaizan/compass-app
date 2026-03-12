import { useCallback, useEffect, useState } from 'react';
import { Impuesto } from '@/types/impuestos';
import { PlazosFijo } from '@/types/bancos';

const ZONE = 'America/Argentina/Buenos_Aires';

/** Normaliza un string de vencimiento a 'yyyy-MM-dd'. Acepta ISO, yyyy-MM-dd, dd/MM/yyyy. */
export function normalizarVencimiento(v: string): string {
/*   if (!v || String(v).trim() === '') return '';
  const s = String(v).trim();
  if (s.includes('T')) {
    const dt = DateTime.fromISO(s, { zone: ZONE });
    return dt.isValid ? dt.toFormat('yyyy-MM-dd') : '';
  }
  let dt = DateTime.fromFormat(s, 'yyyy-MM-dd', { zone: ZONE });
  if (dt.isValid) return dt.toFormat('yyyy-MM-dd');
  dt = DateTime.fromFormat(s, 'dd/MM/yyyy', { zone: ZONE });
  if (dt.isValid) return dt.toFormat('yyyy-MM-dd');
 */  return '';
}

/** Parsea vencimiento a DateTime (inicio del día) o null si es inválido/vacío. */
export function parseVencimiento(v: string): any | null {
  /*   const normalized = normalizarVencimiento(v);
    if (!normalized) return null;
    const dt = DateTime.fromFormat(normalized, 'yyyy-MM-dd', { zone: ZONE });
    return dt.isValid ? dt.startOf('day') : null;
   */
  return null;
}

/** Ordena impuestos por vencimiento: sin fecha al final, "vence hoy" primero, luego por fecha ascendente. */
export function sortImpuestosByVencimiento(impuestos: any[]): any[] {
  /*   const today = DateTime.now().startOf('day');
    return [...impuestos].sort((a, b) => {
      const fechaA = parseVencimiento(a.Vencimiento);
      const fechaB = parseVencimiento(b.Vencimiento);
      if (!fechaA) return 1;
      if (!fechaB) return -1;
      const venceHoyA = today.equals(fechaA);
      const venceHoyB = today.equals(fechaB);
      if (venceHoyA && venceHoyB) return 0;
      if (venceHoyA) return -1;
      if (venceHoyB) return 1;
      return fechaA.toMillis() - fechaB.toMillis();
    });
   */
  return []
}

export type VencimientosHoy = {
  impuestos: Impuesto[];
  plazos: PlazosFijo[];
  total: number;
};

/** Devuelve impuestos y plazos fijos que vencen hoy (mismo día en zona local). */
export function getVencimientosHoy(
  impuestos: any[],
  plazos: any[]
): any {
  /*   const today = DateTime.now().setZone(ZONE).startOf('day');
    const impuestosHoy = impuestos.filter((i) => {
      const d = parseVencimiento(i.Vencimiento ?? '');
      return d !== null && today.equals(d);
    });
    const plazosHoy = plazos.filter((p) => {
      const d = parseVencimiento(p.Vencimiento ?? '');
      return d !== null && today.equals(d);
    }); */
  return {
    impuestos: 0, //impuestosHoy,
    plazos: 0, //plazosHoy,
    total: 0 //impuestosHoy.length + plazosHoy.length,
  };
}

export function MoneyToNumber(money: string) {
  return Number(money.replace(/\$/g, '').replace(/\./g, '').trim().replace(',', '.'))
}

export function NumberToMoney(number: number = 0) {
  return `$ ${number.toFixed(2).replace(/\./g, ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
}

function toDateStr(v: string | Date): string {
  /*   if (v instanceof Date && !Number.isNaN(v.getTime())) return DateTime.fromJSDate(v).setZone(ZONE).toFormat('yyyy-MM-dd');
    return String(typeof v === 'string' ? v : '').trim();
   */
  return "";
}
/** Interés total del plazo (desde Periodo hasta Vencimiento). Para "mensual" se muestra este total; si se quisiera interés por mes: total / (días/30). */
export function calculateMensual(selectedPlazoFijo: any) {
  /*   const periodo = parseVencimiento(toDateStr(selectedPlazoFijo.Periodo));
    const vencimiento = parseVencimiento(toDateStr(selectedPlazoFijo.Vencimiento));
    if (!periodo || !vencimiento) return 0;
    const interval = Interval.fromDateTimes(periodo, vencimiento);
    if (!interval.isValid) return 0;
    const intervaloDias = Math.ceil(interval.length('days'));
    if (intervaloDias <= 0 || !Number.isFinite(intervaloDias)) return 0;
    const capital = Number(selectedPlazoFijo.Capital) || 0;
    const tna = Number(selectedPlazoFijo.TNA) || 0;
    return (capital * (tna / 100) * (intervaloDias / 365));
   */
  return 0;
}

export function calculateDiario(selectedWallet: any) {
  //return (selectedWallet.Efectivo * ((selectedWallet.Interes / 365) * 1) / 100);
}

export function gastoMaximoDiario(efectivo: number, objetivoAhorro: number) {
  return 0;
  //return (efectivo - Math.max(0, objetivoAhorro)) / (DateTime.now().daysInMonth - DateTime.now().day + 1);
}
/** Resuelve Metodo (id) a etiqueta: Nombre de Wallet, Nombre de Banco o "Otros" si está vacío o no coincide. */
export function resolveMetodoLabel(metodo: string | undefined, wallets: any[], bancos: any[]): string {
  /*  if (metodo == null || typeof metodo !== "string" || !metodo.trim()) return "Otros";
    const id = metodo.trim();
    const wallet = wallets.find((w) => w.id === id);
    if (wallet?.Nombre) return wallet.Nombre;
    const banco = bancos.find((b) => b.id === id);
    if (banco?.Nombre) return banco.Nombre;
    return "Otros";
    */
  return "";
}

/**
 * Verifica si un archivo existe en una ruta específica
 * @param path - Ruta del archivo a verificar
 * @returns Promise<boolean> - true si el archivo existe, false en caso contrario
 */
export async function fileExists(path: string): Promise<boolean> {
  if (!path || path.includes('undefined') || path.trim() === '') {
    return false;
  }

  try {
    // Para web: usar fetch para verificar si el archivo existe
    if (globalThis.window !== undefined && fetch !== undefined) {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    }

    // Para React Native/Expo: los assets se manejan de forma estática
    // En este caso, retornamos false ya que no podemos verificar dinámicamente
    // Los assets en Expo deben importarse estáticamente o usar expo-asset
    return false;
  } catch {
    return false;
  }
}

/**
 * Verifica si una imagen existe en una ruta específica
 * @param path - Ruta de la imagen a verificar
 * @returns Promise<boolean> - true si la imagen existe, false en caso contrario
 */
export async function imageExists(path: string): Promise<boolean> {
  if (!path || path.includes('undefined') || path.trim() === '') {
    return false;
  }

  try {
    // Para web: crear una imagen y verificar si se carga correctamente
    if (globalThis.window !== undefined && Image !== undefined) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = path;

        // Timeout de seguridad (5 segundos)
        setTimeout(() => resolve(false), 5000);
      });
    }

    // Fallback: usar fileExists
    return await fileExists(path);
  } catch {
    return false;
  }
}

/** Tema antd para tablas: alineado con paleta de la app (finanzas, mobile y web). */
/* export const tableTheme = {
  token: {
    colorPrimary: colors.primary.main,
    colorBorder: colors.border.light,
    colorText: colors.text.primary,
    colorTextHeading: colors.text.primary,
    fontSize: 14,
  },
  components: {
    Table: {
      headerBg: colors.background.card,
      headerColor: colors.text.primary,
      rowBg: colors.background.card,
      rowColor: colors.text.primary,
      colorBgContainer: colors.background.card,
      headerSplitColor: colors.border.light,
      borderColor: colors.border.light,
    },
    Button: {
      colorLink: colors.primary.main,
      colorLinkHover: colors.primary.main,
      colorLinkActive: colors.primary.main,
    },
    Input: {
      activeBorderColor: colors.primary.main,
      hoverBorderColor: colors.primary.main,
      activeShadow: '0 0 0 2px rgba(14, 116, 144, 0.2)',
    },
    InputNumber: {
      activeBorderColor: colors.primary.main,
      hoverBorderColor: colors.primary.main,
      activeShadow: '0 0 0 2px rgba(14, 116, 144, 0.2)',
    },
    Pagination: {
      itemActiveBg: colors.background.card,
      itemLinkBg: colors.background.card,
    },
  },
};
 */
/** Clave para guardar cuándo se cerró el banner de instalar PWA (no volver a mostrar hasta pasados N días). */
const PWA_INSTALL_DISMISSED_KEY = 'pwa-install-dismissed';
const PWA_INSTALL_DISMISS_DAYS = 7;

function isStandalone(): boolean {
  if (typeof globalThis === 'undefined' || !globalThis.matchMedia) return false;
  return (globalThis.matchMedia('(display-mode: standalone)').matches) || (globalThis as any).navigator?.standalone === true;
}

function isIOS(): boolean {
  if (typeof globalThis === 'undefined' || !(globalThis as any).navigator?.userAgent) return false;
  return /iPad|iPhone|iPod/.test((globalThis as any).navigator.userAgent);
}

function wasDismissedRecently(): boolean {
  try {
    const raw = globalThis.localStorage?.getItem(PWA_INSTALL_DISMISSED_KEY);
    if (!raw) return false;
    const t = Number(raw);
    if (Number.isNaN(t)) return false;
    return Date.now() - t < PWA_INSTALL_DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function setDismissed(): void {
  try {
    globalThis.localStorage?.setItem(PWA_INSTALL_DISMISSED_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

/** Prompt capturado compartido entre montajes (p. ej. InstallPromptCapture → InstallAppBanner). */
let deferredPromptGlobal: BeforeInstallPromptEvent | null = null;

export type InstallPromptState = {
  canInstall: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  isWeb: boolean;
  isMobile: boolean;
  showBanner: boolean;
  prompt: (() => Promise<void>) | null;
  dismiss: () => void;
};

/**
 * Hook para mostrar el banner de instalar PWA. Solo tiene efecto en web.
 * Devuelve showBanner true cuando conviene mostrar la opción de instalar (mobile, no standalone, no cerrado recientemente).
 */
export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => deferredPromptGlobal);
  const [standalone, setStandalone] = useState(isStandalone);
  const [windowSize, setWindowSize] = useState(0);
  const [userDismissed, setUserDismissed] = useState(false);
  const isWeb = true //Platform.OS === 'web';
  const isMobile = false //windowSize.width < 576;

  const dismiss = useCallback(() => {
    setDismissed();
    setUserDismissed(true);
  }, []);

  useEffect(() => {
    //if (Platform.OS !== 'web' || typeof globalThis === 'undefined' || !globalThis.addEventListener) return;
    const handler = (e: Event) => {
      e.preventDefault();
      const ev = e as BeforeInstallPromptEvent;
      deferredPromptGlobal = ev;
      setDeferredPrompt(ev);
    };
    globalThis.addEventListener('beforeinstallprompt', handler);
    return () => globalThis.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (true) return;
/*     const sub = Dimensions.addEventListener?.('change', () => {
      setStandalone(isStandalone());
      setWindowSize(Dimensions.get('window'));
    });
 */    return () => { } //sub?.remove();
  }, []);

  // Mostrar cuando hay prompt (para poder llamar prompt() y evitar el aviso de Chrome) o iOS en mobile; ocultar si el usuario cerró
  const showBanner = !userDismissed && isWeb && !standalone && !wasDismissedRecently() && (!!deferredPrompt || (isIOS() && isMobile));

  const prompt = deferredPrompt
    ? async () => {
      try {
        await deferredPrompt.prompt();
        const r = await deferredPrompt.userChoice;
        if (r?.outcome === 'accepted') {
          deferredPromptGlobal = null;
          setDeferredPrompt(null);
        }
      } catch {
        // ignore
      }
    }
    : null;

  return {
    canInstall: !!deferredPrompt,
    isIOS: isIOS(),
    isStandalone: standalone,
    isWeb,
    isMobile,
    showBanner,
    prompt,
    dismiss,
  };
}

/** Tipo del evento beforeinstallprompt (no está en todos los tipos de DOM). */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function getApiUrl() {
  //const envUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/';
  let apiUrl = "" //envUrl.trim();

  // Ensure URL ends with /
  if (!apiUrl.endsWith('/')) {
    apiUrl += '/';
  }

  // In web environment, if page is HTTPS but API is HTTP, this will cause SSL errors
  // Check if we're in a secure context and API is HTTP
  const protocol = globalThis.window?.location.protocol;
  if (protocol === 'https:' && apiUrl.startsWith('http://')) {
    console.warn('Warning: Page is HTTPS but API URL is HTTP. This may cause SSL errors.');
    console.warn('Consider using HTTPS for your API or HTTP for local development.');
  }

  return apiUrl;
};

/* export function proyeccionDiaria(gastadoHoy: number) {
  const now = DateTime.now();

  const hoursPassed =
    now.hour +
    now.minute / 60 +
    now.second / 3600;

  const hoursTotal = 24;

  const projected =
    hoursPassed > 0
      ? (gastadoHoy / hoursPassed) * hoursTotal
      : 0;

  return projected;
}
 */
// hooks/useBreakpoint.ts

export function useBreakpoint() {
  const { width, height } = { width: 1100, height: 500 };

  const isPortrait = height > width;
  const isMobile = isPortrait && width < 768;
  const isTablet = !isMobile && width >= 768 && width < 1200;
  const isDesktop = !isMobile && !isTablet;

  return { width, height, isMobile, isTablet, isDesktop, isPortrait };
}

/** @deprecated Use useBreakpoint().isMobile instead. Kept for backward compatibility with cached bundles. */
export function useDisplayMode(): boolean {
  return useBreakpoint().isMobile
}