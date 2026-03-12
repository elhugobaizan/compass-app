// =========================
// BORDERS
// =========================

const border = {
  light: '#E2E8F0',
  default: '#CBD5E1',
  strong: '#94A3B8',
};

export const colors = {
  // =========================
  // BRAND
  // =========================

  primary: {
    700: '#155A6C',
    600: '#1F6F8B', // principal (patrimonio, liquidez importante)
    main: '#1F6F8B', // principal (patrimonio, liquidez importante)
    500: '#2C89A0',
    400: '#4FA3BF', // secondary emphasis (fondos, secundarios)
    link: '#4FA3BF', // secondary emphasis (fondos, secundarios)
    300: '#7FBFD4',
  },

  // =========================
  // BACKGROUND
  // =========================

  background: {
    header: '#0F172A',
    app: '#F8FAFC',      // fondo principal
    sidebar: '#0F172A',  // sidebar
    card: '#FFFFFF',
  },

  // =========================
  // TEXT
  // =========================

  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#64748B',
    inverse: '#FFFFFF',
    muted: '#94A3B8',
  },

  // =========================
  // NEUTRALS (estructura)
  // =========================

  neutral: {
    900: '#0F172A',
    800: '#1E293B',
    700: '#334155',
    600: '#475569',
    500: '#64748B',
    400: '#94A3B8',
    300: '#CBD5E1',
    200: '#E2E8F0',
    100: '#F1F5F9',
  },

  // =========================
  // FINANCIAL SEMANTIC COLORS
  // =========================

  financial: {

    // dinero líquido inmediato
    liquid: '#1F6F8B',

    // liquidez secundaria (fondos)
    semiLiquid: '#4FA3BF',

    // reserva de valor estable (USD, CEDEARS)
    stableStore: '#64748B',

    // activo volátil (cripto)
    volatile: '#334155',

    // ahorro mensual
    savings: '#2C89A0',

    // ingreso
    income: '#2D9C5A',

    // gasto
    expense: '#D64545',

  },

  // =========================
  // STATUS (UI states)
  // =========================

  status: {

    positive: '#1F6F8B',
    neutral: '#6B7280',
    warning: '#B45309',
    negative: '#B91C1C',

  },

  border,

  // =========================
  // PROGRESS / SEGMENTS
  // =========================

  progress: {

    background: '#E2E8F0',

    liquidity: '#1F6F8B',
    funds: '#4FA3BF',
    usd: '#64748B',
    crypto: '#334155',

  },

  // =========================
  // OVERLAYS
  // =========================

  overlay: {
    light: 'rgba(15, 23, 42, 0.04)',
    medium: 'rgba(15, 23, 42, 0.08)',
    strong: 'rgba(15, 23, 42, 0.16)',
  },

  // =========================
  // PERFORMANCE
  // =========================

  performance: {
    leader: "#16A34A",
    competitive: border.default,
    underperforming: "#B45309",
  },

  error: {
    background: '#fef2f2',
    border: '#fecaca',
    text: '#fecaca',
  },

  // =========================
  // GOALS SECTION
  // =========================

  goals: {
    primary: '#4F46E5',
    primarySoft: '#EEF2FF',
    primaryDark: '#3730A3',
    accent: '#7C3AED',
    accentSoft: '#F3E8FF',
  }

};