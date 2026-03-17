export const ACCOUNT_GROUPS = {
  LIQUID: 1,
  INVESTMENT: 2,
  DEBT: 3,
} as const;

export const accountGroupLabels: Record<number, string> = {
  [ACCOUNT_GROUPS.LIQUID]: "LIQUID",
  [ACCOUNT_GROUPS.INVESTMENT]: "INVESTMENT",
  [ACCOUNT_GROUPS.DEBT]: "DEBT",
};