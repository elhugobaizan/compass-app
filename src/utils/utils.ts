export function MoneyToNumber(money: string) {
  return Number(money.replaceAll(/\$/, '').replaceAll(/\./, '').trim().replace(',', '.'))
}

export function NumberToMoney(number: number = 0) {
  return `$ ${number.toFixed(2).replaceAll(/\./, ',').replaceAll(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
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

/** Tipo del evento beforeinstallprompt (no está en todos los tipos de DOM). */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function getApiUrl() {
  const envUrl = 'http://localhost:3000/';
  let apiUrl = envUrl.trim();

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

export function useBreakpoint() {
  const { width, height } = { width: window.innerWidth, height: window.innerHeight };

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