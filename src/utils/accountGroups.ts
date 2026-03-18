export const ACCOUNT_GROUPS = {
  LIQUID: 'LIQUID',
  INVESTMENT: 'INVESTMENT',
  DEBT: 'DEBT',
} as const;

export const accountGroupLabels: Record<string, string> = {
  [ACCOUNT_GROUPS.LIQUID]: "LIQUID",
  [ACCOUNT_GROUPS.INVESTMENT]: "INVESTMENT",
  [ACCOUNT_GROUPS.DEBT]: "DEBT",
};